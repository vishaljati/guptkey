import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateEntry, deleteEntry } from "@/features/vaultSlicer";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import PasswordCard from "@/components/vault/PasswordCard";
import DeleteConfirmModal from "@/components/vault/DeleteConfirmModal";
import EmptyVault from "@/components/vault/EmptyVault";
import { toast } from "@/hooks/use-toast";

const Favorites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vault = useSelector((state: RootState) => state.vault.vault);

  if (!vault) {
    navigate("/login");
    return null;
  }
  const addEntry = () => {
    navigate("/dashboard")
  }

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Only favorites
  const favoriteEntries = useMemo(() => {
    return vault.entries.filter((entry) => entry.isFavorite);
  }, [vault.entries]);

  const handleDelete = () => {
    if (!deleteId) return;

    dispatch(deleteEntry(deleteId));

    toast({
      title: "Removed",
      description: "Credential deleted permanently.",
    });

    setDeleteId(null);
  };

  const handleToggleFavorite = (id: string) => {
    const entry = vault.entries.find((e) => e.id === id);
    if (!entry) return;

    dispatch(
      updateEntry({
        ...entry,
        isFavorite: !entry.isFavorite,
        updatedAt: Date.now(),
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 p-8">

        <div className="flex items-center gap-3 mb-8">
          <Star className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-bold">Favorite Passwords</h1>
        </div>

        {favoriteEntries.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyVault onAdd={addEntry} />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {favoriteEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <PasswordCard
                    entry={entry}
                    onEdit={() => { }} // optional: implement later
                    onDelete={(id) => setDeleteId(id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <DeleteConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          siteName={
            vault.entries.find((p) => p.id === deleteId)?.site ?? ""
          }
        />
      </div>
    </div>
  );
};

export default Favorites;