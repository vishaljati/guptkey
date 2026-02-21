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
    await onSave();
    setStatus("success");

    // Reset back to idle after a delay
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <motion.button
      onClick={handlePress}
      disabled={status === "loading"}
      className="relative overflow-hidden group px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
      initial={false}
      animate={{
        backgroundColor: status === "success" ? "#10b981" : "#3b82f6",
        scale: status === "loading" ? 0.95 : 1,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shimmer Effect (Attracts user) */}
      {status === "idle" && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", repeatDelay: 3 }}
        />
      )}

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-white"
          >
            <Save className="w-4 h-4" />
            <span>Save Vault</span>
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 text-white"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Syncing...</span>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-white"
          >
            <Check className="w-4 h-4" />
            <span>Changes Saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
};