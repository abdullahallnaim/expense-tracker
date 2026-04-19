import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

export interface Workspace {
  ownerUid: string;
  ownerEmail: string;
  ownerName: string;
}

export interface Member {
  email: string;
  addedAt: number;
}

interface WorkspaceContextType {
  /** UID whose data is currently displayed */
  activeOwnerUid: string | null;
  /** Available workspaces: own + shared with me */
  workspaces: Workspace[];
  /** Members invited to MY workspace */
  members: Member[];
  /** Is the active workspace owned by the current user? */
  isOwner: boolean;
  loading: boolean;
  switchWorkspace: (ownerUid: string) => void;
  inviteMember: (email: string) => Promise<void>;
  removeMember: (email: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_KEY = "active-workspace-uid";

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [activeOwnerUid, setActiveOwnerUid] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Register / refresh user's email->uid mapping on sign in
  useEffect(() => {
    if (!user?.email) return;
    const emailKey = user.email.toLowerCase();
    setDoc(
      doc(db, "userByEmail", emailKey),
      {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
      },
      { merge: true }
    ).catch(console.error);

    // Also register self as owner workspace doc for discoverability
    setDoc(
      doc(db, "users", user.uid, "meta", "profile"),
      {
        email: user.email,
        name: user.displayName || "",
        updatedAt: Date.now(),
      },
      { merge: true }
    ).catch(console.error);
  }, [user]);

  // Load list of workspaces shared with me + my own
  useEffect(() => {
    if (!user?.email) {
      setWorkspaces([]);
      setLoading(false);
      return;
    }
    const emailKey = user.email.toLowerCase();
    const sharedRef = collection(db, "userByEmail", emailKey, "sharedWorkspaces");

    const unsub = onSnapshot(sharedRef, (snap) => {
      const shared: Workspace[] = snap.docs.map((d) => {
        const data = d.data() as { ownerEmail?: string; ownerName?: string };
        return {
          ownerUid: d.id,
          ownerEmail: data.ownerEmail || "",
          ownerName: data.ownerName || data.ownerEmail || "শেয়ারড",
        };
      });
      const own: Workspace = {
        ownerUid: user.uid,
        ownerEmail: user.email!,
        ownerName: `${user.displayName || "আমি"} (নিজের)`,
      };
      const list = [own, ...shared.filter((w) => w.ownerUid !== user.uid)];
      setWorkspaces(list);

      // Init active workspace
      const stored = localStorage.getItem(STORAGE_KEY);
      const valid = stored && list.some((w) => w.ownerUid === stored);
      setActiveOwnerUid(valid ? stored : user.uid);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // Subscribe to my own workspace members
  useEffect(() => {
    if (!user) {
      setMembers([]);
      return;
    }
    const membersRef = collection(db, "users", user.uid, "members");
    const unsub = onSnapshot(membersRef, (snap) => {
      const list: Member[] = snap.docs.map((d) => {
        const data = d.data() as { addedAt?: number };
        return { email: d.id, addedAt: data.addedAt || 0 };
      });
      setMembers(list.sort((a, b) => b.addedAt - a.addedAt));
    });
    return () => unsub();
  }, [user]);

  const switchWorkspace = (ownerUid: string) => {
    setActiveOwnerUid(ownerUid);
    localStorage.setItem(STORAGE_KEY, ownerUid);
  };

  const inviteMember = async (rawEmail: string) => {
    if (!user?.email) throw new Error("Not signed in");
    const email = rawEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) throw new Error("সঠিক ইমেইল দিন");
    if (email === user.email.toLowerCase()) throw new Error("নিজেকে যোগ করা যাবে না");

    // Add to my members list
    await setDoc(doc(db, "users", user.uid, "members", email), {
      email,
      addedAt: Date.now(),
    });

    // Add a shared-workspace pointer under invitee's email entry
    await setDoc(
      doc(db, "userByEmail", email, "sharedWorkspaces", user.uid),
      {
        ownerEmail: user.email,
        ownerName: user.displayName || "",
        sharedAt: Date.now(),
      },
      { merge: true }
    );
  };

  const removeMember = async (rawEmail: string) => {
    if (!user) return;
    const email = rawEmail.trim().toLowerCase();
    await deleteDoc(doc(db, "users", user.uid, "members", email));
    await deleteDoc(doc(db, "userByEmail", email, "sharedWorkspaces", user.uid));
  };

  const isOwner = !!user && activeOwnerUid === user.uid;

  return (
    <WorkspaceContext.Provider
      value={{
        activeOwnerUid,
        workspaces,
        members,
        isOwner,
        loading,
        switchWorkspace,
        inviteMember,
        removeMember,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
};
