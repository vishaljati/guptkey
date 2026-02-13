import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Shield, Star, Search, LayoutGrid, List } from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import PasswordCard from "@/components/vault/PasswordCard";
import AddEditModal from "@/components/vault/AddEditModal";
import DeleteConfirmModal from "@/components/vault/DeleteConfirmModal";
import EmptyVault from "@/components/vault/EmptyVault";
import { toast } from "@/hooks/use-toast";
import type { PasswordEntry } from "@/components/vault/PasswordCard";

// Mock data remains the same
const initialPasswords: PasswordEntry[] = [
  { id: "1", site: "GitHub", username: "dev@guptkey.com", password: "Gh$7kL!mP2xQ", isFavorite: true },
  { id: "2", site: "Google", username: "user@gmail.com", password: "xR9#wN4$vB7z", isFavorite: false },
  { id: "3", site: "AWS Console", username: "admin@company.io", password: "aW5&jT8!qK3m", isFavorite: true },
  { id: "4", site: "Figma", username: "designer@studio.com", password: "fG2@hY6*nC1p", isFavorite: false },
  { id: "5", site: "Slack", username: "team@startup.dev", password: "sL4#dF9!bV7x", isFavorite: false },
  { id: "6", site: "Notion", username: "notes@work.com", password: "nT8$kM2!wQ5r", isFavorite: true },
];

const Dashboard = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>(initialPasswords);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Quick stats calculations
  const stats = useMemo(() => ({
    total: passwords.length,
    favorites: passwords.filter(p => p.isFavorite).length,
    security: "Strong" // Mock security score
  }), [passwords]);

  const filtered = useMemo(() => {
    if (!searchQuery) return passwords;
    const q = searchQuery.toLowerCase();
    return passwords.filter((p) => p.site.toLowerCase().includes(q) || p.username.toLowerCase().includes(q));
  }, [passwords, searchQuery]);

  const deleteSiteName = passwords.find((p) => p.id === deleteId)?.site || "";

  const handleSave = (entry: Omit<PasswordEntry, "id" | "isFavorite"> & { id?: string }) => {
    if (entry.id) {
      setPasswords((prev) => prev.map((p) => (p.id === entry.id ? { ...p, ...entry } : p)));
      toast({ title: "Vault Updated", description: `${entry.site} credentials updated.` });
    } else {
      const newEntry: PasswordEntry = { ...entry, id: Date.now().toString(), isFavorite: false };
      setPasswords((prev) => [newEntry, ...prev]);
      toast({ title: "Added to Vault", description: `New entry for ${entry.site} saved.` });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setPasswords((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Removed", description: "Credential deleted permanently." });
  };

  const handleToggleFavorite = (id: string) => {
    setPasswords((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)));
  };

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <DashboardHeader
          onSearch={setSearchQuery}
          onAddNew={() => { setEditEntry(null); setModalOpen(true); }}
        />

        <main className="flex-1 p-6 lg:p-10 relative z-10">
          {/* Dashboard Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Assets", value: stats.total, icon: LayoutGrid, color: "text-blue-400" },
              { label: "Favorites", value: stats.favorites, icon: Star, color: "text-amber-400" },
              { label: "Vault Health", value: stats.security, icon: Shield, color: "text-emerald-400" },
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={stat.label}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-950/50 border border-slate-800 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Recent Logins
              <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full">
                {filtered.length}
              </span>
            </h2>
            <div className="flex bg-slate-950/50 border border-slate-800 rounded-lg p-1">
              <button title="Grid View" aria-label="Grid View" className="p-1.5 rounded-md bg-slate-800 text-slate-200"><LayoutGrid className="w-4 h-4" /></button>
              <button title="List View" aria-label="List View" className="p-1.5 rounded-md text-slate-500 hover:text-slate-300"><List className="w-4 h-4" /></button>
            </div>
          </div>

          {filtered.length === 0 && !searchQuery ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <EmptyVault onAdd={() => { setEditEntry(null); setModalOpen(true); }} />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl"
            >
              <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No entries matching "<span className="text-slate-200 font-medium">{searchQuery}</span>"</p>
              <button onClick={() => setSearchQuery("")} className="mt-4 text-primary hover:underline text-sm font-medium">Clear search</button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVars}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((entry) => (
                  <motion.div
                    key={entry.id}
                    variants={itemVars}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PasswordCard
                      entry={entry}
                      onEdit={(e) => { setEditEntry(e); setModalOpen(true); }}
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

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => { setEditEntry(null); setModalOpen(true); }}
        type="button"
        title="Add New Password"
        aria-label="Add New Password"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modals remain functionally the same but benefit from global theme styles */}
      <AddEditModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditEntry(null); }}
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