import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { KeyRound, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, Lock, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

// --- Custom Vector Component ---
const SecurityIllustration = () => (
  <motion.div 
    animate={{ y: [0, -15, 0] }} 
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative w-64 h-64 mx-auto mb-8"
  >
    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full">
      <path d="M100 20L40 45V90C40 127.3 65.6 162.1 100 171C134.4 162.1 160 127.3 160 90V45L100 20Z" fill="currentColor" className="text-primary/10" stroke="currentColor" strokeWidth="2"/>
      <motion.path 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d="M100 30L50 51V90C50 121.1 71.4 150.1 100 157.5C128.6 150.1 150 121.1 150 90V51L100 30Z" 
        stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round"
      />
      <rect x="85" y="85" width="30" height="40" rx="4" fill="currentColor" className="text-primary" />
      <path d="M90 85V75C90 69.4772 94.4772 65 100 65C105.523 65 110 69.4772 110 75V85" stroke="currentColor" className="text-primary" strokeWidth="4" />
    </svg>
  </motion.div>
);

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
    <div className="min-h-screen bg-[#020817] text-slate-50 flex overflow-hidden">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.08),transparent)]" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">GuptKey</span>
          </Link>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
          <SecurityIllustration />
          <motion.div
            key={isRegister ? "reg-text" : "login-text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold leading-tight mb-6">
              {isRegister ? "Join the gold" : "Your secrets"} <br />
              {isRegister ? "standard of" : "deserve"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">privacy.</span>
            </h2>
            <p className="text-slate-400 max-w-md text-lg leading-relaxed">
              Zero-knowledge architecture. Open-source transparency. <br />
              <span className="text-slate-200">The last vault you'll ever need.</span>
            </p>
          </motion.div>
        </div>

        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           className="relative z-10 flex gap-6 text-sm text-slate-500"
        >
          <span>© 2026 GuptKey</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> AES-256 Encrypted</span>
        </motion.div>
      </div>

      {/* Right Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-950/50 backdrop-blur-sm relative">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg aspect-square bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md z-10"
        >
          <div className="glass-panel p-8 sm:p-10 border border-slate-800 bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? "register" : "login"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-3xl font-bold mb-2">
                  {isRegister ? "Create Vault" : "Welcome Back"}
                </h1>
                <p className="text-slate-400 mb-8">
                  {isRegister ? "Setup your master key to begin." : "Unlock your encrypted workspace."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                    <div className="relative group">
                       <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all group-hover:border-slate-700"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Master Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 pr-12 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all group-hover:border-slate-700"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    <AnimatePresence>
                      {password && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-1 overflow-hidden"
                        >
                          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${strength.pct}%` }}
                              className={`h-full rounded-full ${strength.color} shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-colors duration-500`}
                            />
                          </div>
                          <p className="text-[10px] uppercase tracking-widest font-bold mt-1.5 text-slate-500 flex justify-between">
                            <span>Security Level:</span>
                            <span className="text-slate-300">{strength.label}</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>{isRegister ? "Initialize Vault" : "Unlock Vault"}</>
                    )}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                {isRegister ? "Already a member?" : "New to GuptKey?"}{" "}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-primary hover:underline font-semibold underline-offset-4 transition-all"
                >
                  {isRegister ? "Sign in instead" : "Create a new vault"}
                </button>
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center gap-8 text-xs text-slate-600 font-medium">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Help Center</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;