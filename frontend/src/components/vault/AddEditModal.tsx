import { useState, useEffect, useCallback } from "react";
import { X, Eye, EyeOff, RefreshCw, Save } from "lucide-react";
import type { PasswordEntry } from "./PasswordCard";

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<PasswordEntry, "id" | "isFavorite"> & { id?: string }) => void;
  editEntry?: PasswordEntry | null;
}

const generatePassword = (length: number, options: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }) => {
  let chars = "";
  if (options.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.numbers) chars += "0123456789";
  if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const AddEditModal = ({ isOpen, onClose, onSave, editEntry }: AddEditModalProps) => {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });

  useEffect(() => {
    if (editEntry) {
      setSite(editEntry.site);
      setUsername(editEntry.username);
      setPassword(editEntry.password);
    } else {
      setSite("");
      setUsername("");
      setPassword("");
      setNotes("");
    }
  }, [editEntry, isOpen]);

  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(genLength, genOptions));
  }, [genLength, genOptions]);

  const handleSave = () => {
    if (!site || !username || !password) return;
    onSave({ id: editEntry?.id, site, username, password });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-backdrop-in" />
      <div
        className="relative w-full max-w-lg glass-panel-strong p-6 animate-modal-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {editEntry ? "Edit Password" : "Add New Password"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors" title="Close modal" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="site" className="block text-sm font-medium text-muted-foreground mb-1.5">Site Name</label>
            <input
              id="site"
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="e.g. GitHub"
              title="Site name"
              aria-label="Site name"
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1.5">Username / Email</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="user@example.com"
              title="Username or email"
              aria-label="Username or email"
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2.5 pr-20 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  title="Password generator"
                  aria-label="Password generator"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Password Generator */}
          {showGenerator && (
            <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3 animate-in-up">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Length: {genLength}</span>
                <button
                  onClick={handleGenerate}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Generate
                </button>
              </div>
              <input
                title="password gen input"
                type="range"
                min={8}
                max={64}
                value={genLength}
                onChange={(e) => setGenLength(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex flex-wrap gap-3">
                {(["upper", "lower", "numbers", "symbols"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={genOptions[key]}
                      onChange={() => setGenOptions((o) => ({ ...o, [key]: !o[key] }))}
                      className="rounded border-border accent-primary"
                      title={`Include ${key}`}
                      aria-label={`Include ${key}`}
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-1.5">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional notes..."
              title="Notes"
              aria-label="Notes"
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!site || !username || !password}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
          >
            <Save className="w-4 h-4" />
            {editEntry ? "Update Password" : "Save Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
