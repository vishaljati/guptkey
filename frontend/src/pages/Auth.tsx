import { useState } from "react";
import { Link, useSearchParams ,useNavigate} from "react-router-dom";
import {
  KeyRound, Eye, EyeOff, Loader2, ShieldCheck,
  Lock, User, Mail, ArrowRight, Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";


import api from "@/lib/axios";

const navigate=useNavigate()
// --- Utility: Password Strength Logic ---
const getStrength = (pw: string) => {
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

// --- Shared: Security Illustration ---
const SecurityIllustration = () => (
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative w-64 h-64 mx-auto mb-8"
  >
    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
    <svg viewBox="0 0 200 200" fill="none" className="relative z-10 w-full h-full">
      <path d="M100 20L40 45V90C40 127.3 65.6 162.1 100 171C134.4 162.1 160 127.3 160 90V45L100 20Z" fill="currentColor" className="text-primary/10" stroke="currentColor" strokeWidth="2" />
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

// --- Component: Login Form ---
const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      window.location.href = "/dashboard";

    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-slate-400">Unlock your encrypted workspace.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              placeholder="agent@guptkey.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Master Password</label>
            <button type="button" className="text-[10px] text-primary hover:underline uppercase tracking-tighter">Forgot Key?</button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              placeholder="••••••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Fingerprint className="w-5 h-5" /> Unlock Vault</>}
        </button>
      </form>

      <div className="text-center pt-4 border-t border-slate-800/50">
        <p className="text-sm text-slate-500">
          New to GuptKey? <button onClick={onToggle} className="text-primary font-bold hover:underline">Create a new vault</button>
        </p>
      </div>
    </div>
  );
};

// --- Component: SignUp Form ---
const SignUpForm = ({ onToggle }: { onToggle: () => void }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(formData.password);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    try {

      const registerUser=await api.post("/auth/signup",
        {
          name:formData.name,
          email:formData.email,
          password:formData.password
        }
      )
      if (!registerUser) {
        console.warn("User registration failed..Try again later")
        throw new Error("Backend for registration failed")
      }

       navigate("/auth");

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Create Vault</h1>
        <p className="text-slate-400">Setup your master key to begin.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              placeholder="Vishal Jati"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Master Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              placeholder="••••••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {formData.password && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.pct}%` }}
                    className={`h-full rounded-full ${strength.color} transition-all duration-500`}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Strength</span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">{strength.label}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Initialize Vault</>}
        </button>
      </form>

      <div className="text-center pt-4 border-t border-slate-800/50">
        <p className="text-sm text-slate-500">
          Already a member? <button onClick={onToggle} className="text-primary font-bold hover:underline">Sign in instead</button>
        </p>
      </div>
    </div>
  );
};

// --- Main Auth Component ---
const Auth = () => {
  const [params] = useSearchParams();
  const [isRegister, setIsRegister] = useState(params.get("register") === "true");

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 flex overflow-hidden">
      {/* LEFT: Branding Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative bg-slate-950 border-r border-slate-900">
        {/* Abstract cyber grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.1),transparent)]" />

        <Link to="/" className="relative z-10 flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">GuptKey</span>
        </Link>

        <div className="relative z-10">
          <SecurityIllustration />
          <motion.div
            key={isRegister ? "reg-text" : "login-text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight">
              {isRegister ? "Join the gold" : "Your secrets"} <br />
              {isRegister ? "standard of" : "deserve"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">privacy.</span>
            </h2>
            <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
              Zero-knowledge architecture. Open-source transparency. The last vault you'll ever need.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256</span>
          <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-500" /> End-to-End</span>
        </div>
      </div>

      {/* RIGHT: Auth Container */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[440px] z-10"
        >
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
            {/* Animated top border line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? "register-form" : "login-form"}
                initial={{ opacity: 0, x: isRegister ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRegister ? -20 : 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isRegister ? (
                  <SignUpForm onToggle={() => setIsRegister(false)} />
                ) : (
                  <LoginForm onToggle={() => setIsRegister(true)} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
            <button className="hover:text-primary transition-colors">Privacy</button>
            <button className="hover:text-primary transition-colors">Terms</button>
            <button className="hover:text-primary transition-colors">Security</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;