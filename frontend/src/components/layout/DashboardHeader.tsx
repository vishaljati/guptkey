import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  User,
  Settings,
  LogOut,
  Loader2,
  Menu,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/features/authSlicer";
import { clearVault } from "@/features/vaultSlicer";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { LogoutUser } from "@/service/auth.api";
import { isAxiosError } from "axios";
import { useVaultContext } from "@/components/vault/vaultProvider";

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onAddNew: () => void;
  rightElement?: React.ReactNode;
  onMenuClick?: () => void; // optional mobile sidebar trigger
}

const DashboardHeader = ({
  onSearch,
  onAddNew,
  rightElement,
  onMenuClick,
}: DashboardHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyRef } = useVaultContext();

  const name = useSelector((state: RootState) => state.auth.name);
  const email = useSelector((state: RootState) => state.auth.email);

  const handleSearch = (val: string) => {
    setSearchValue(val);
    onSearch(val);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await LogoutUser();

      keyRef.current = null;
      dispatch(logout(null));
      dispatch(clearVault());
      navigate("/login");

      toast({
        title: "Logged out successfully",
        description: "Your vault has been locked.",
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast({
          title: "Logout failed",
          description:
            error.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout failed",
          description: "Unexpected error occurred. Try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md shadow-sm">

      {/* ===== Top Row ===== */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">

        {/* Left Section (Menu + Logo) */}
        <div className="flex items-center gap-3 min-w-0">

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="text-lg font-semibold tracking-wide text-foreground whitespace-nowrap">
            GuptKey
          </div>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Desktop Save Slot */}
          {rightElement && (
            <div className="hidden md:block">
              {rightElement}
            </div>
          )}

          {/* Desktop Add Button */}
          <button
            onClick={onAddNew}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Password
          </button>

          {/* Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center p-2 rounded-lg hover:bg-secondary/50 transition"
              aria-label="User menu"
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">

                {/* User Info */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {email}
                  </p>
                </div>

                <div className="border-t border-border my-2" />

                {/* Settings */}
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                  className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-secondary/50 rounded-lg transition"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </button>

                {/* Logout */}
                {loading ? (
                  <div className="flex justify-center py-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-2 py-2 mt-1 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ===== Mobile Search ===== */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* ===== Mobile Action Buttons ===== */}
      <div className="md:hidden px-4 pb-4 grid grid-cols-2 gap-3">
        {rightElement}

        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* ===== Desktop Search ===== */}
      <div className="hidden md:block px-6 pb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

    </header>
  );
};

export default DashboardHeader;