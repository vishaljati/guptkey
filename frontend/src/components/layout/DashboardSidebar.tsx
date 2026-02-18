import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Star, Settings, LogOut, Menu, X, KeyRound ,Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearVault } from "@/features/vaultSlicer";
import { logout } from "@/features/authSlicer";
import { toast } from "@/hooks/use-toast";
import { logoutUser } from "@/service/auth.api"

const navItems = [
  { icon: Shield, label: "All Passwords", path: "/dashboard" },
  { icon: Star, label: "Favorites", path: "/dashboard/favorites" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const DashboardSidebar = () => {
  const [loading,setLoading]=useState(false)
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const dispatch=useDispatch()
  const navigate=useNavigate()

  const handelLogout=async()=>{
    try {
      setLoading(true)
      await logoutUser()
    } catch (error) {
      console.error("Logout API failed:", error);
    }finally{

    dispatch(clearVault());
    dispatch(logout(null));

    navigate("/login", { replace: true });
    toast({
      title: "Logged out",
      description: "Your vault has been locked.",
    });
    }
    setLoading(false)
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        title="mobile"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border md:hidden"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">GuptKey</span>
          </Link>
          <button title="mobile" onClick={() => setMobileOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === "/dashboard" && location.pathname.startsWith("/dashboard"));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          {loading ?
          <Loader2 className="w-5 h-5 animate-spin" />
          :<button
            title="logout"
            onClick={handelLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
           <LogOut className="w-4 h-4" />
            Logout
          </button>}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
