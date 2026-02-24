import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Lock, Clock, Download, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  requestPasswordResetApi,
  changePasswordWithOtpApi,
  requestOtpForDeleteAccountApi,
  confirmDeleteAccountApi,
  cancelAccountDeletionApi
} from "@/service/user.api"
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/authSlicer"
import { clearVault } from "@/features/vaultSlicer"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { generateSalt, bufferToBase64 } from "@/crypto/utils";
import { deriveKey } from "@/crypto/deriveKey";
import { encryptVault } from "@/crypto/encrypt";
import { useVaultContext } from "@/components/vault/vaultProvider";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

const SettingsPage = () => {
  useSessionTimeout()
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [deletionStep, setDeletionStep] = useState<"idle" | "otp-sent">("idle");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { keyRef } = useVaultContext();
  const [timeout, setTimeoutVal] = useState(
    localStorage.getItem("sessionTimeout") || "15"
  );

  const vault = useSelector((state: RootState) => state.vault.vault);
  //Password Change
  const handleRequestOtpforPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordResetApi(oldPassword)
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code.",
      });

      setStep(2);
      setOldPassword("");
    } catch (error: unknown) {
      let message = "Otp sending failed";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: "OTP sending failed",
        description: message,
        variant: "destructive",
      });

    } finally {
      setLoading(false);
    }
  };
  const handleConfirmChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      if (!vault) throw new Error("Vault missing");
      const salt = generateSalt();
      const key = await deriveKey(newPassword, salt);
      const { encryptedData, iv } = await encryptVault(vault, key);
      await changePasswordWithOtpApi({
        otp,
        newPassword,
        encryptedData,
        iv,
        salt: bufferToBase64(salt.buffer)
      })

      toast({
        title: "Password Changed",
        description: "Please login again.",
      });
      setNewPassword("")
      keyRef.current = null
      dispatch(logout(null))
      dispatch(clearVault())
      navigate("/login")

    } catch (error: any) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Password change failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  //Account Deletion
  const handleRequestOtpforAccountDeletion = async () => {
    try {
      setLoading(true);
      await requestOtpForDeleteAccountApi()
      toast({
        title: "OTP Sent",
        description: "Check your email for verification code.",
      });
      setDeletionStep("otp-sent");
    } catch (error: any) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: "Failed to sent OTP",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDelete = async () => {

    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await confirmDeleteAccountApi(otp)
      toast({
        title: "Account Deleted Successfully",
        description: "Your vault has been permanently removed.",
      });

      dispatch(logout(null));
      dispatch(clearVault());
      keyRef.current = null
      navigate("/signup");

    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: "Account Deletion Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const cancelDeleting = async () => {
    setLoading(true)
    try {
      await cancelAccountDeletionApi()
      setDeletionStep("idle")
      toast({
        title: "Account Deletion Cancelled"
      })

    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: "Account deletion cancellation failed!",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }

  }
  //Change timeout 
  const handleTimeoutChange = (value: string) => {
    setTimeoutVal(value);
    localStorage.setItem("sessionTimeout", value);

    toast({
      title: "Saved",
      description: `Session timeout set to ${value} minutes.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="md:ml-64">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center px-6 sticky top-0 z-30">
          <Link to="/dashboard" className="mr-3 text-muted-foreground hover:text-foreground transition-colors md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </header>

        <main className="p-6 max-w-2xl space-y-6 animate-in-up">
          {/* Change master password */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Change Master Password</h2>
            </div>
            {step === 1 &&
              (<form onSubmit={handleRequestOtpforPasswordChange} className="space-y-3">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200"
                >
                  {loading ? "Verifying..." : "Request OTP"}
                </button>
              </form>)}
            {step === 2 &&
              (<form onSubmit={handleConfirmChange} className="space-y-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New password"
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200"
                >
                  {loading ? "Updating..." : "Confirm & Change Password"}
                </button>
              </form>)}

          </div>

          {/* Session timeout */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Session Timeout</h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeout}
                onChange={(e) => handleTimeoutChange(e.target.value)}
                className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                title="Select session timeout duration"
              >
                <option value="1">1 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
              <span className="text-sm text-muted-foreground">Auto-lock after inactivity</span>
            </div>
          </div>


          {/* Danger zone */}
          <div className="glass-panel p-6 border-destructive/30">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="w-4 h-4 text-destructive" />
              <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete your account and all vault data. This action is irreversible.
            </p>
            {deletionStep === "idle" && (<button
              onClick={handleRequestOtpforAccountDeletion}
              className="px-5 py-2.5 bg-destructive/10 text-destructive text-sm font-semibold rounded-lg hover:bg-destructive/20 transition-all duration-200 border border-destructive/20"
            >
              Delete Account
            </button>)}
            {deletionStep === "otp-sent" && (
              <form onSubmit={handleConfirmDelete} className="space-y-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-destructive/10 text-destructive text-sm font-semibold rounded-lg hover:bg-destructive/20 transition-all duration-200 border border-destructive/20"
                >
                  {loading ? "Deleting All data..." : "Confirm Delete"}
                </button>
                <button
                  disabled={loading}
                  onClick={cancelDeleting}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200"
                >
                  {loading ? "Cancelling..." : "Cancel"}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;