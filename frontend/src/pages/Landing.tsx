import { Link } from "react-router-dom";
import { KeyRound, Shield, Lock, Eye } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Zero-Knowledge Encryption",
    description: "We never see your data. Your master password never leaves your device.",
  },
  {
    icon: Lock,
    title: "AES-256-GCM Security",
    description: "Military-grade encryption protects every credential you store.",
  },
  {
    icon: Eye,
    title: "Private by Design",
    description: "Built from the ground up with privacy as the core principle.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">GuptKey</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/auth?register=true"
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="animate-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8">
            <Shield className="w-3 h-3" />
            Zero-Knowledge Security
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
            Your Secrets.
            <br />
            <span className="text-gradient">Your Key.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            The password manager that puts privacy first. End-to-end encrypted, open, and designed for people who care about security.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/auth?register=true"
              className="px-8 py-3.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] hover:scale-[1.02]"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3.5 bg-secondary text-secondary-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-all duration-200 border border-border"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`glass-panel p-6 glow-border-hover animate-in-up-delay-${i + 1}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 GuptKey. Privacy-first password management.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
