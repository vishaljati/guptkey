import { useState, useRef, useEffect } from "react";
import { Search, Plus, User, Settings, LogOut ,Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/features/authSlicer";
import { clearVault } from "@/features/vaultSlicer";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { LogoutUser } from "@/service/auth.api"
import { isAxiosError } from "axios"
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
  const [loading, setLoading] = useState(false)
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
      setLoading(true)
      await LogoutUser()
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
        const message = error.response?.data?.message || "Something went wrong";
        toast({
          title: "Logout Failed",
          description: message,
          variant: "destructive",

        });
      } else {
        toast({
          title: "Logout Failed",
          description: "Unexpected Error occured.Try again later.",
          variant: "destructive",

        });
      }
    } finally {
      setLoading(false)
    }

  }

  // Close dropdown when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search passwords..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-3 ml-4">
        <div className="flex items-center gap-2 px-4 py-2 ">
         {rightElement}
        </div>
        

        {/* Add Button */}
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Password</span>
        </button>

        {/* User Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Show name on larger screens */}
            <span className="hidden md:block text-sm font-medium text-foreground">
              {name}
            </span>
          </button>

          {/* Dropdown */}
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

              {loading ?
                <Loader2 className="w-5 h-5 animate-spin" />
                : <button
                  title="logout"
                  onClick={handelLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;