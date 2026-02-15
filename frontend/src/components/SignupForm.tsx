import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Lock,
  User,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { SignupUser } from "@/service/auth.api";
import { createEmptyVault } from "@/crypto/vaultFactory";
import { generateSalt, bufferToBase64 } from "@/crypto/utils";
import { deriveKey } from "@/crypto/deriveKey";
import { encryptVault } from "@/crypto/encrypt";

const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", pct: 20, color: "bg-red-500" };
  if (score <= 2) return { label: "Fair", pct: 40, color: "bg-orange-500" };
  if (score <= 3) return { label: "Good", pct: 60, color: "bg-yellow-500" };
  if (score <= 4) return { label: "Strong", pct: 80, color: "bg-primary/70" };
  return { label: "Very Strong", pct: 100, color: "bg-primary" };
};

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = getStrength(formData.password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "All fields are required.",
      });
      return;
    }

    if (strength.label === "Weak") {
      toast({
        title: "Weak Password",
        description: "Use a stronger master password.",
      });
      return;
    }

    try {
      setLoading(true);
      const salt = generateSalt();
      const key = await deriveKey(formData.password, salt);
      const emptyVault = createEmptyVault();

      const { encryptedData, iv } = await encryptVault(
        emptyVault,
        key
      );
      const res = await SignupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        encryptedData,
        iv,
        salt: bufferToBase64(
          new Uint8Array(salt).buffer
        )
        ,
      });

      if (res.status !== 201) {
        throw new Error(
          res?.data?.data?.message || "Registration failed"
        );
      }

      toast({
        title: "Registration Successful",
        description: "Redirecting to login...",
      });

      navigate("/login");

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Vault
        </h1>
        <p className="text-slate-400">
          Setup your master key to begin.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">

        {/* NAME */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              placeholder="Vishal Jati"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              placeholder="domain@companyname.com"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            Master Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              placeholder="Enter your master password."
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2"
              >
                <div className="h-1.5 w-full bg-slate-800 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.pct}%` }}
                    className={`h-full rounded-full ${strength.color}`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Initialize Vault
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-4 border-t border-slate-800/50">
        <p className="text-sm text-slate-500">
          Already a member?{" "}
          <Link
            to="/login"
            className="text-primary font-bold hover:underline"
          >
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
