import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  addEntry,
  updateEntry,
  deleteEntry,
} from "@/features/vaultSlicer";
import { useVaultContext } from "@/components/vault/vaultProvider";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Shield, Star, Search, LayoutGrid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveVaultGlobally } from "@/crypto/vaultService"
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import PasswordCard from "@/components/vault/PasswordCard";
import AddEditModal from "@/components/vault/AddEditModal";
import DeleteConfirmModal from "@/components/vault/DeleteConfirmModal";
import EmptyVault from "@/components/vault/EmptyVault";
import { toast } from "@/hooks/use-toast";
import { AnimatedSaveButton } from "@/components/AnimatedSaveButton"
import type { PasswordEntry } from "@/types/password.types";
import type { PasswordFormData } from "@/types/password.types";
import { markClean } from "@/features/vaultSlicer";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";


const Dashboard = () => {
  useSessionTimeout()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vault = useSelector((state: RootState) => state.vault.vault);
  const passwords = vault?.entries ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { keyRef } = useVaultContext();
  const isDirty = useSelector((state: RootState) => state.vault.isDirty) as boolean;


  // 📊 Stats
  const stats = useMemo(() => ({
    total: passwords.length,
    favorites: passwords.filter(p => p.isFavorite).length,
    security: "Strong",
  }), [passwords]);

  // 🔎 Search Filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return passwords;

    const q = searchQuery.toLowerCase();

    return passwords.filter(
      (p) =>
        p.site.toLowerCase().includes(q) ||
        p.usernameOrEmail.toLowerCase().includes(q)
    );
  }, [passwords, searchQuery]);

  const deleteSiteName = passwords.find((p) => p.id === deleteId)?.site ?? "";

  //Save (Add / Update)
  const handleSave = (data: PasswordFormData, id?: string) => {
    if (!vault) return;
    if (id) {
      const existing = vault.entries.find(e => e.id === id);
      if (!existing) return;

      dispatch(updateEntry({
        ...existing,
        site: data.site,
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
        notes: data.notes ?? "",
        updatedAt: Date.now(),
      }));


      toast({
        title: "Vault Updated",
        description: `${data.site} credentials updated.`,
      });

    } else {
      dispatch(addEntry({
        id: crypto.randomUUID(),
        site: data.site,
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
        notes: data.notes || "",
        isFavorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));

      toast({
        title: "Added to Vault",
        description: `New entry for ${data.site} saved.`,
      });
    }

    setModalOpen(false);
    setEditEntry(null);
  };

  // ❌ Delete
  const handleDelete = () => {
    if (!deleteId) return;

    dispatch(deleteEntry(deleteId));

    toast({
      title: "Removed",
      description: "Credential deleted permanently.",
    });

    setDeleteId(null);
  };

  // ⭐ Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    if (!vault) return;

    const entry = vault.entries.find(e => e.id === id);
    if (!entry) return;

    dispatch(updateEntry({
      ...entry,
      isFavorite: !entry.isFavorite,
      updatedAt: Date.now(),
    }));
  };

  // 🎬 Animations
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  const handleGlobalSave = async () => {
    if (!isDirty) return;
    if (!keyRef.current) {
      console.error("Key not initialized");
      return;
    }

    if (!vault) {
      throw new Error("Vault is empty. Nothing to save..")
    }
    try {
      await saveVaultGlobally(
        vault,
        keyRef.current
      );
      
      dispatch(markClean());

      toast({
        title: "Vault Synced",
        description: "All changes saved securely.",
      });

    } catch (error: unknown) {
      let message = "Failed to save vault";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: "Save Failed",
        description: message,
        variant: "destructive",
      });

    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <DashboardHeader
          onSearch={setSearchQuery}
          onAddNew={() => {
            setEditEntry(null);
            setModalOpen(true);
          }}
          rightElement={
            <AnimatePresence>
              {isDirty && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AnimatedSaveButton onSave={handleGlobalSave} />
                </motion.div>
              )}
            </AnimatePresence>
          }
        />

        <main className="flex-1 p-6 lg:p-10 relative z-10">

          {/* 📊 Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Assets", value: stats.total, icon: LayoutGrid, color: "text-blue-400" },
              { label: "Favorites", value: stats.favorites, icon: Star, color: "text-amber-400" },
              { label: "Vault Health", value: stats.security, icon: Shield, color: "text-emerald-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-950/50 border border-slate-800 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 🔎 List Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Vault Entries
              <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full">
                {filtered.length}
              </span>
            </h2>

            <div className="flex bg-slate-950/50 border border-slate-800 rounded-lg p-1">
              <button title="something" className="p-1.5 rounded-md bg-slate-800 text-slate-200">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button title="something" className="p-1.5 rounded-md text-slate-500 hover:text-slate-300">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 🗂 Content */}
          {filtered.length === 0 && !searchQuery ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <EmptyVault onAdd={() => setModalOpen(true)} />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl"
            >
              <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No entries matching "<span className="text-slate-200 font-medium">{searchQuery}</span>"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-primary hover:underline text-sm font-medium"
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVars}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((entry) => (
                  <motion.div
                    key={entry.id}
                    variants={itemVars}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <PasswordCard
                      entry={entry}
                      onEdit={(e) => {
                        setEditEntry(e);
                        setModalOpen(true);
                      }}
                      onDelete={(id) => setDeleteId(id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      {/* ➕ Mobile FAB */}
      <button
        title="mobile fab"
        onClick={() => {
          setEditEntry(null);
          setModalOpen(true);
        }}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* 🧩 Modals */}
      <AddEditModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditEntry(null);
        }}
        onSave={handleSave}
        editEntry={editEntry}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        siteName={deleteSiteName}
      />
    </div>
  );
};

export default Dashboard;
