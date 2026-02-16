import { useState } from "react";
import { Copy, Edit2, Trash2, Star, Eye, EyeOff, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {PasswordEntry} from "@/types/password.types"


interface PasswordCardProps {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}


const PasswordCard = ({ entry, onEdit, onDelete, onToggleFavorite }: PasswordCardProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const getInitials = (site: string) => site.slice(0, 2).toUpperCase();

  return (
    <div className="glass-panel p-4 glow-border-hover group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
            {getInitials(entry.site)}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">{entry.site}</h3>
            <p className="text-xs text-muted-foreground truncate">{entry.usernameOrEmail}</p>
          </div>
        </div>
        <button
          title="favourite"
          onClick={() => onToggleFavorite(entry.id)}
          className="text-muted-foreground hover:text-yellow-400 transition-colors"
        >
          <Star className={`w-4 h-4 ${entry.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-secondary/50">
        <span className="flex-1 text-sm font-mono text-muted-foreground truncate">
          {showPassword ? entry.password : "••••••••••••"}
        </span>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => copyToClipboard(entry.password, "Password")}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all"
        >
          <Copy className="w-3 h-3" /> Copy
        </button>
        <button
          onClick={() => onEdit(entry)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all"
        >
          <Edit2 className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
        >
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  );
};

export type { PasswordEntry };
export default PasswordCard;
