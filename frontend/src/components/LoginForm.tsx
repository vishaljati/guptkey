import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye, EyeOff, Loader2,
    Lock, Mail, Fingerprint
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { login } from "@/features/authSlicer";
import { setVault } from "@/features/vaultSlicer";
import { LoginUser } from "@/service/auth.api";
import { deriveKey } from "@/crypto/deriveKey";
import { decryptVault } from "@/crypto/decrypt";
import { base64ToBuffer } from "@/crypto/utils";
import { useVaultContext } from "@/components/vault/vaultProvider.tsx";
import axios from "axios";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { keyRef } = useVaultContext();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast({
                title: "Email and Password required"
            })
            return;
        }
        try {
            setLoading(true);
            const response = await LoginUser({ email, password });
            const {
                Name,
                Email,
                encryptedData,
                iv,
                salt,
            } = response.data?.data;

            if (!Name || !Email || !encryptedData || !iv || !salt) {
                toast({
                    title: "Login Failed",
                    description: "Internal server error",
                    variant: "destructive"
                })
                return;
            }

            //Convert salt from base64
            const saltBytes = new Uint8Array(
                base64ToBuffer(salt)
            );
            //Derive key
            const key = await deriveKey(password, saltBytes);
            keyRef.current = key;
            //Decrypt vault
            const vault = await decryptVault(
                encryptedData,
                iv,
                key
            );
            dispatch(
                login({
                    isLoggedIn: true,
                    name: Name,
                    email:Email
                })
            );
            dispatch(setVault(vault));
            setPassword("");
            toast({
                title: "Vault Unlocked",
                description: "Welcome back",
            });

            navigate("/dashboard", { replace: true });

        } catch (error: any) {
            console.log("Actual error:", error);
            let message = "Invalid Credentials";
            if (axios.isAxiosError(error)) {
                message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            toast({
                title: "Login Failed",
                description: message,
                variant: "destructive",
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
                    New to GuptKey?

                    <Link to="/signup">
                        <button className="text-primary font-bold hover:underline">
                            Create a new vault
                        </button>
                    </Link>

                </p>
            </div>
        </div>
    );
};

export default LoginForm;