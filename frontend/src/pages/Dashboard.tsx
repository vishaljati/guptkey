import { useState, useMemo } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import PasswordCard from "@/components/vault/PasswordCard";
import AddEditModal from "@/components/vault/AddEditModal";
import DeleteConfirmModal from "@/components/vault/DeleteConfirmModal";
import EmptyVault from "@/components/vault/EmptyVault";
import { toast } from "@/hooks/use-toast";
import type { PasswordEntry } from "@/components/vault/PasswordCard";

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

  const filtered = useMemo(() => {
    if (!searchQuery) return passwords;
    const q = searchQuery.toLowerCase();
    return passwords.filter((p) => p.site.toLowerCase().includes(q) || p.username.toLowerCase().includes(q));
  }, [passwords, searchQuery]);

  const deleteSiteName = passwords.find((p) => p.id === deleteId)?.site || "";

  const handleSave = (entry: Omit<PasswordEntry, "id" | "isFavorite"> & { id?: string }) => {
    if (entry.id) {
      setPasswords((prev) => prev.map((p) => (p.id === entry.id ? { ...p, ...entry } : p)));
      toast({ title: "Updated", description: "Password entry updated successfully." });
    } else {
      const newEntry: PasswordEntry = { ...entry, id: Date.now().toString(), isFavorite: false };
      setPasswords((prev) => [newEntry, ...prev]);
      toast({ title: "Added", description: "New password saved to your vault." });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setPasswords((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Deleted", description: "Password removed from your vault." });
  };

  const handleToggleFavorite = (id: string) => {
    setPasswords((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="md:ml-64">
        <DashboardHeader onSearch={setSearchQuery} onAddNew={() => { setEditEntry(null); setModalOpen(true); }} />
        <main className="p-6">
          {filtered.length === 0 && !searchQuery ? (
            <EmptyVault onAdd={() => { setEditEntry(null); setModalOpen(true); }} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No passwords match your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in-up">
              {filtered.map((entry) => (
                <PasswordCard
                  key={entry.id}
                  entry={entry}
                  onEdit={(e) => { setEditEntry(e); setModalOpen(true); }}
                  onDelete={(id) => setDeleteId(id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </main>
      </div>

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
