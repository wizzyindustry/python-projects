import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, BarChart3, Share2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Trophy, title: "Create Leagues", desc: "Set up a new league in under a minute with a simple, guided flow." },
  { icon: Users, title: "Manage Teams", desc: "Add, edit, and organize teams effortlessly before the season starts." },
  { icon: Calendar, title: "Auto Fixtures", desc: "Generate round-robin fixtures automatically — no manual scheduling." },
  { icon: BarChart3, title: "Live Standings", desc: "Tables update instantly as you enter match results." },
  { icon: Share2, title: "Share Leagues", desc: "Give participants a public link to follow standings and results." },
  { icon: Zap, title: "Fast & Simple", desc: "No spreadsheets, no complexity — just clean league management." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold text-foreground">LeagueHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log in</Button>
            <Button size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light/50 to-teal/20" />
        <div className="container relative py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Manage Your Leagues
            <br />
            <span className="text-cyan">Like a Pro</span>
          </h1>
          <p className="text-lg md:text-xl text-cyan-light/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Create leagues, generate fixtures, track results, and share standings — all in one simple platform built for organizers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              Start Free
            </Button>
            <Button variant="hero-outline" size="xl" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              See Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From league creation to live standings — manage it all without spreadsheets.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-primary-foreground">
        <div className="container py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ditch the spreadsheets?</h2>
          <p className="text-cyan-light/70 mb-8 max-w-lg mx-auto">
            Join organizers who save hours every season with automated league management.
          </p>
          <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
            Create Your First League
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LeagueHub. Built for organizers.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
