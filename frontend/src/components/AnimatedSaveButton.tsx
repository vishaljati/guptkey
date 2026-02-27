import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Check } from "lucide-react";

interface SaveButtonProps {
  onSave: () => Promise<void> | void;
}

export const AnimatedSaveButton = ({ onSave }: SaveButtonProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handlePress = async () => {
    if (status !== "idle") return;
    
    setStatus("loading");
    try {
      await onSave();
    } finally {
      setStatus("success");
      // Reset back to idle after a slightly longer delay for better UX
      setTimeout(() => setStatus("idle"), 2500); 
    }
  };

  return (
    <motion.button
      onClick={handlePress}
      disabled={status !== "idle"} // Disable interaction during both loading and success
      className="relative overflow-hidden group w-full md:w-auto flex justify-center items-center gap-2 px-5 py-3 md:py-2.5 rounded-xl font-medium text-base md:text-sm text-white border border-white/10 transition-all outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      initial={false}
      animate={{
        // Deep slate for idle, rich emerald for success
        backgroundColor: status === "success" ? "#059669" : "#0f172a", 
        // Dynamic glow based on state
        boxShadow: status === "success" 
          ? "0 8px 20px -4px rgba(5, 150, 105, 0.5)" 
          : "0 8px 20px -4px rgba(15, 23, 42, 0.4)",
        scale: status === "loading" ? 0.97 : 1,
      }}
      whileHover={status === "idle" ? { scale: 1.02 } : {}}
      whileTap={status === "idle" ? { scale: 0.96 } : {}}
    >
      {/* Subtle top inner highlight for a 3D glass effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-50" />

      {/* Premium Shimmer Effect */}
      {status === "idle" && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 4 }}
        />
      )}

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2.5"
          >
            <Save className="w-5 h-5 sm:w-4 sm:h-4 text-slate-300 group-hover:text-white transition-colors duration-300" />
            <span className="tracking-wide">Save Vault</span>
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2.5"
          >
            <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin text-slate-300" />
            <span className="tracking-wide text-slate-100">Syncing...</span>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center gap-2.5"
          >
            <Check className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
            <span className="tracking-wide font-semibold text-white">Saved Securely</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};