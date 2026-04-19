import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  variant?: "icon" | "pill";
}

const LanguageToggle = ({ variant = "pill" }: LanguageToggleProps) => {
  const { lang, toggle } = useLang();

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="text-muted-foreground hover:text-primary"
        title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
      >
        <Languages className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm font-medium"
      title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
    >
      <Languages className="h-4 w-4 text-primary" />
      <span className={lang === "bn" ? "text-primary font-semibold" : "text-muted-foreground"}>বাং</span>
      <span className="text-muted-foreground">/</span>
      <span className={lang === "en" ? "text-primary font-semibold" : "text-muted-foreground"}>EN</span>
    </button>
  );
};

export default LanguageToggle;
