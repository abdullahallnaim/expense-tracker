import { NavLink } from "react-router-dom";
import { Home, Target, BarChart3, Share2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const { t } = useLang();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t("signOutSuccess"));
      navigate("/");
    } catch {
      toast.error(t("signOutFailed"));
    }
  };

  const itemBase =
    "flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium text-muted-foreground transition-colors";
  const active = "text-primary";

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_-2px_hsl(var(--foreground)/0.08)]">
      <div className="flex items-stretch">
        <NavLink to="/app" end className={({ isActive }) => cn(itemBase, isActive && active)}>
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  isActive ? "bg-primary text-primary-foreground w-12 h-8" : "w-8 h-8"
                )}
              >
                <Home className="h-5 w-5" />
              </div>
              <span>{t("app")}</span>
            </>
          )}
        </NavLink>
        <NavLink to="/overview" className={({ isActive }) => cn(itemBase, isActive && active)}>
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  isActive ? "bg-primary text-primary-foreground w-12 h-8" : "w-8 h-8"
                )}
              >
                <Target className="h-5 w-5" />
              </div>
              <span>{t("overview")}</span>
            </>
          )}
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => cn(itemBase, isActive && active)}>
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  isActive ? "bg-primary text-primary-foreground w-12 h-8" : "w-8 h-8"
                )}
              >
                <BarChart3 className="h-5 w-5" />
              </div>
              <span>{t("dashboard")}</span>
            </>
          )}
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => cn(itemBase, isActive && active)}>
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  isActive ? "bg-primary text-primary-foreground w-12 h-8" : "w-8 h-8"
                )}
              >
                <Share2 className="h-5 w-5" />
              </div>
              <span>{t("share")}</span>
            </>
          )}
        </NavLink>
        <button onClick={handleSignOut} className={itemBase}>
          <div className="flex items-center justify-center w-8 h-8">
            <LogOut className="h-5 w-5" />
          </div>
          <span>{t("signOut")}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
