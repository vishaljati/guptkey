import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Lock, Clock, Download, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [timeout, setTimeoutVal] = useState("15");

  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Password updated", description: "Your master password has been changed." });
    setCurrentPw("");
    setNewPw("");
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
            <form onSubmit={handleChangePw} className="space-y-3">
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="New password"
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                Update Password
              </button>
            </form>
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
                onChange={(e) => { setTimeoutVal(e.target.value); toast({ title: "Saved", description: `Session timeout set to ${e.target.value} minutes.` }); }}
                className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              >
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
              <span className="text-sm text-muted-foreground">Auto-lock after inactivity</span>
            </div>
          </div>

          {/* Export */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Export Vault</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Download an encrypted backup of your vault data.</p>
            <button
              onClick={() => toast({ title: "Exporting...", description: "Your vault backup is being prepared." })}
              className="px-5 py-2.5 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80 transition-all duration-200 border border-border"
            >
              Export Vault
            </button>
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
            <button
              onClick={() => toast({ title: "Account deletion", description: "This feature requires confirmation via email.", variant: "destructive" })}
              className="px-5 py-2.5 bg-destructive/10 text-destructive text-sm font-semibold rounded-lg hover:bg-destructive/20 transition-all duration-200 border border-destructive/20"
            >
              Delete Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
