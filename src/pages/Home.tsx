import { Navigate, Link } from "react-router-dom";
import { ShoppingBasket, Users, BarChart3, CloudCog, Sparkles, ShieldCheck, ArrowRight, Target, Wallet, LayoutDashboard, CalendarDays, CheckCircle2, LogIn, ListPlus, LineChart, Quote, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { toast } from "sonner";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.7 2.3 12.1S6.6 21.9 12 21.9c6.9 0 9.5-4.8 9.5-7.6 0-.5-.1-.9-.1-1.4H12z"/>
  </svg>
);

const Home = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const { t, fmtNum } = useLang();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success(t("signInSuccess"));
    } catch (e) {
      console.error(e);
      toast.error(t("signInFailed"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (user) return <Navigate to="/app" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="container max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/15 p-2 rounded-xl">
            <ShoppingBasket className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground">{t("appName")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button onClick={handleSignIn} variant="outline" className="gap-2">
            <GoogleIcon className="h-4 w-4" />
            {t("signIn")}
          </Button>
        </div>
      </header>

      <section className="container max-w-6xl mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm mb-6">
          <Sparkles className="h-4 w-4" />
          {t("homeBadge")}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight max-w-3xl mx-auto leading-tight">
          {t("homeHero1")} <span className="text-primary">{t("homeHeroAccent")}</span> {t("homeHero2")}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">{t("homeSubtitle")}</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={handleSignIn} size="lg" className="add-button gap-2 text-base h-12 px-6">
            <GoogleIcon className="h-5 w-5" />
            {t("googleStart")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">{t("freeNoCard")}</p>
        </div>

        <div className="mt-14 max-w-3xl mx-auto">
          <div className="date-card p-6 text-left shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">{t("overview")}</span>
              </div>
              <span className="total-badge">{t("homePreviewIncome")}</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              <div className="rounded-lg bg-success/10 p-3">
                <p className="text-xs text-muted-foreground">{t("totalIncome")}</p>
                <p className="font-bold text-foreground">{t("currency")}{fmtNum(50000)}</p>
              </div>
              <div className="rounded-lg bg-secondary/10 p-3">
                <p className="text-xs text-muted-foreground">{t("totalExpense")}</p>
                <p className="font-bold text-foreground">{t("currency")}{fmtNum(34500)}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="text-xs text-muted-foreground">{t("balance")}</p>
                <p className="font-bold text-foreground">{t("currency")}{fmtNum(15500)}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: t("catVeggies"), spent: 3200, budget: 4000, color: "hsl(145, 45%, 42%)", ok: true },
                { name: t("catTransport"), spent: 4800, budget: 4000, color: "hsl(28, 85%, 55%)", ok: false },
                { name: t("catOil"), spent: 600, budget: 1500, color: "hsl(45, 80%, 50%)", ok: true },
              ].map((i) => {
                const pct = Math.min(100, Math.round((i.spent / i.budget) * 100));
                return (
                  <div key={i.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: i.color }} />
                        <span className="text-foreground font-medium">{i.name}</span>
                        {i.ok ? (
                          <span className="text-xs text-success flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {t("withinBudgetShort")}
                          </span>
                        ) : (
                          <span className="text-xs text-destructive font-medium">{t("exceeded")}</span>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        {t("currency")}{fmtNum(i.spent)} / {t("currency")}{fmtNum(i.budget)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: i.ok ? i.color : "hsl(var(--destructive))",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">{t("featuresTitle")}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">{t("featuresSubtitle")}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Target, title: t("homeFeatBudgetTitle"), desc: t("homeFeatBudgetDesc"), color: "text-primary", bg: "bg-primary/10" },
            { icon: Wallet, title: t("homeFeatIncomeTitle"), desc: t("homeFeatIncomeDesc"), color: "text-success", bg: "bg-success/10" },
            { icon: LayoutDashboard, title: t("homeFeatOverviewTitle"), desc: t("homeFeatOverviewDesc"), color: "text-secondary", bg: "bg-secondary/10" },
            { icon: CalendarDays, title: t("homeFeatDateTitle"), desc: t("homeFeatDateDesc"), color: "text-primary", bg: "bg-primary/10" },
            { icon: Users, title: t("featShareTitle"), desc: t("featShareDesc"), color: "text-secondary", bg: "bg-secondary/10" },
            { icon: BarChart3, title: t("featDashTitle"), desc: t("featDashDesc"), color: "text-success", bg: "bg-success/10" },
            { icon: CloudCog, title: t("featSyncTitle"), desc: t("featSyncDesc"), color: "text-primary", bg: "bg-primary/10" },
          ].map((f) => (
            <div key={f.title} className="date-card p-6">
              <div className={`${f.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <f.icon className={`h-6 w-6 ${f.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t("statsTitle")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("statsSubtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: t("stat1Num"), label: t("stat1Label") },
            { num: t("stat2Num"), label: t("stat2Label") },
            { num: t("stat3Num"), label: t("stat3Label") },
            { num: t("stat4Num"), label: t("stat4Label") },
          ].map((s) => (
            <div key={s.label} className="date-card p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{s.num}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">{t("howTitle")}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">{t("howSubtitle")}</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: LogIn, title: t("how1Title"), desc: t("how1Desc"), step: 1 },
            { icon: ListPlus, title: t("how2Title"), desc: t("how2Desc"), step: 2 },
            { icon: LineChart, title: t("how3Title"), desc: t("how3Desc"), step: 3 },
          ].map((s) => (
            <div key={s.step} className="date-card p-6 relative">
              <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {fmtNum(s.step)}
              </div>
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">{t("testimonialsTitle")}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">{t("testimonialsSubtitle")}</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { q: t("test1Quote"), n: t("test1Name"), r: t("test1Role") },
            { q: t("test2Quote"), n: t("test2Name"), r: t("test2Role") },
            { q: t("test3Quote"), n: t("test3Name"), r: t("test3Role") },
          ].map((tt) => (
            <div key={tt.n} className="date-card p-6 flex flex-col">
              <Quote className="h-6 w-6 text-primary/40 mb-3" />
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-5 leading-relaxed flex-1">"{tt.q}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary">
                  {tt.n.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{tt.n}</p>
                  <p className="text-xs text-muted-foreground">{tt.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">{t("faqTitle")}</h2>
        <p className="text-center text-muted-foreground mb-10">{t("faqSubtitle")}</p>
        <Accordion type="single" collapsible className="date-card px-6">
          {[
            { q: t("faq1Q"), a: t("faq1A") },
            { q: t("faq2Q"), a: t("faq2A") },
            { q: t("faq3Q"), a: t("faq3A") },
            { q: t("faq4Q"), a: t("faq4A") },
            { q: t("faq5Q"), a: t("faq5A") },
          ].map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container max-w-6xl mx-auto px-4 py-16">
          <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t("ctaTitle")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-7">{t("ctaDesc")}</p>
          <Button onClick={handleSignIn} size="lg" className="add-button gap-2 h-12 px-6 text-base">
            <GoogleIcon className="h-5 w-5" />
            {t("googleSignIn")}
          </Button>
        </div>
      </section>

      <footer className="container max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {t("appName")} · <Link to="/app" className="hover:text-foreground">{t("app")}</Link>
      </footer>
    </div>
  );
};

export default Home;
