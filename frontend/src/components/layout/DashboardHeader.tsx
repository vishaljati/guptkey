import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  User,
  Settings,
  LogOut,
  Loader2,
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
}

const DashboardHeader = ({
  onSearch,
  onAddNew,
  rightElement,
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

  const handelLogout = async () => {
    try {
      setLoading(true);
      await LogoutUser();
      keyRef.current = null;
      dispatch(logout(null));
      dispatch(clearVault());
      navigate("/login");
      toast({
        title: "Logged out Successfully",
        description: "Your vault has been locked.",
      });
    } catch (error: any) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Something went wrong";
        toast({
          title: "Logout Failed",
          description: message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout Failed",
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
    <header className="border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-30">

      {/* Top Row */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="font-semibold text-lg tracking-wide text-foreground max-w-[140px] truncate">
          GuptKey
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Desktop Save */}
          {rightElement && (
            <div className="hidden md:block">
              {rightElement}
            </div>
          )}

          {/* Desktop Add */}
          <button
            onClick={onAddNew}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Password
          </button>

          {/* User Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              title="open"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-xl shadow-xl p-4 z-50">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {email}
                  </p>
                </div>

                <div className="border-t border-border my-2" />

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                  className="flex items-center gap-2 w-full px-2 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </button>

                {loading ? (
                  <div className="flex justify-center py-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <button
                    onClick={handelLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
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

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="md:hidden px-4 pb-4 grid grid-cols-2 gap-3">
        {rightElement}

        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:block px-6 pb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
          />
        </div>
      </div>

    </header>
  );
};

export default DashboardHeader;