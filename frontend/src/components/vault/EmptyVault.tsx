import { ShieldOff } from "lucide-react";

interface EmptyVaultProps {
  onAdd: () => void;
}

const EmptyVault = ({ onAdd }: EmptyVaultProps) => (
  <div className="flex flex-col items-center justify-center py-20 animate-in-up">
    <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
      <ShieldOff className="w-10 h-10 text-muted-foreground/50" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">Your vault is empty</h3>
    <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
      Start adding your passwords to keep them safe and organized.
    </p>
    <button
      onClick={onAdd}
      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
    >
      Add Your First Password
    </button>
  </div>
);

export default EmptyVault;
