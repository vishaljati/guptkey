import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { KeyRound, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const getStrength = (pw: string): { label: string; pct: number; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", pct: 20, color: "bg-destructive" };
  if (score <= 2) return { label: "Fair", pct: 40, color: "bg-orange-500" };
  if (score <= 3) return { label: "Good", pct: 60, color: "bg-yellow-500" };
  if (score <= 4) return { label: "Strong", pct: 80, color: "bg-primary/70" };
  return { label: "Very Strong", pct: 100, color: "bg-primary" };
};

const Auth = () => {
  const [params] = useSearchParams();
  const [isRegister, setIsRegister] = useState(params.get("register") === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: isRegister ? "Account created!" : "Welcome back!", description: "Redirecting to your vault..." });
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/3" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">GuptKey</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Your secrets
            <br />
            deserve <span className="text-gradient">better</span>.
          </h2>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Military-grade encryption meets elegant simplicity. Your passwords, your control.
          </p>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © 2026 GuptKey
        </div>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm animate-in-up">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 lg:hidden">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="glass-panel p-8">
            <div className="flex items-center gap-2.5 mb-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">GuptKey</span>
            </div>

            <h1 className="text-xl font-bold text-foreground mb-1">
              {isRegister ? "Create your vault" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {isRegister ? "Start securing your passwords today." : "Enter your master password to unlock."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Master Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter master password"
                    className="w-full px-3 py-2.5 pr-10 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{strength.label}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isRegister ? "Create Vault" : "Unlock Vault"}
              </button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              {isRegister ? "Already have a vault?" : "Don't have a vault?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {isRegister ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
