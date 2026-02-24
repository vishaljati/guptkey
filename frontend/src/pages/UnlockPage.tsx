import { useState, useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setVault } from "@/features/vaultSlicer";
import { useVaultContext } from "@/components/vault/vaultProvider";
import { deriveKey } from "@/crypto/deriveKey";
import { decryptVault } from "@/crypto/decrypt";
import { base64ToBuffer } from "@/crypto/utils";
import { getEncryptedVaultApi } from "@/service/vault.api";

const UnlockPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [vaultMeta, setVaultMeta] = useState<any>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyRef } = useVaultContext();

  // Fetch encrypted vault metadata on mount
  useEffect(() => {
    const fetchVault = async () => {
      try {
        const res = await getEncryptedVaultApi();
        setVaultMeta(res.data.data);
      } catch (error: any) {
        toast({
          title: "Session Expired",
          description: "Please login again.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
      }
    };

    fetchVault();
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast({
        title: "Password Required",
        description: "Enter your master password.",
        variant: "destructive",
      });
      return;
    }

    if (!vaultMeta) return;

    try {
      setLoading(true);

      const { encryptedData, iv, salt } = vaultMeta;

      const saltBytes = new Uint8Array(base64ToBuffer(salt));
      const key = await deriveKey(password, saltBytes);

      const vault = await decryptVault(encryptedData, iv, key);

      // Restore encryption key
      keyRef.current = key;

      // Restore vault
      dispatch(setVault(vault));

      setPassword("");

      toast({
        title: "Vault Unlocked",
        description: "Welcome back.",
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast({
        title: "Unlock Failed",
        description: "Incorrect master password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md glass-panel p-8">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold">Unlock Vault</h1>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter master password"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Unlock"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnlockPage;