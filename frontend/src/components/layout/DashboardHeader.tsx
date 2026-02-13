import { useState } from "react";
import { Search, Plus, User } from "lucide-react";

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onAddNew: () => void;
}

const DashboardHeader = ({ onSearch, onAddNew }: DashboardHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (val: string) => {
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
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
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Password</span>
        </button>

        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
