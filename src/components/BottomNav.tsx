import { NavLink, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Target, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
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

  const items = [
    { to: "/", icon: Home, label: t("homeNav"), end: true },
    { to: "/app", icon: LayoutGrid, label: t("app"), end: false },
    { to: "/overview", icon: Target, label: t("overview"), end: false },
    { to: "/dashboard", icon: BarChart3, label: t("dashboard"), end: false },
  ];

  const itemBase =
    "flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors min-w-0";
  const activeCls = "text-primary";

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_-2px_hsl(var(--foreground)/0.1)]">
      <div className="flex items-stretch">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(itemBase, isActive && activeCls)}
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground w-12 h-8"
                      : "w-8 h-8"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="truncate max-w-full px-1">{label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button onClick={handleSignOut} className={itemBase} type="button">
          <div className="flex items-center justify-center w-8 h-8">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="truncate max-w-full px-1">{t("signOut")}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
