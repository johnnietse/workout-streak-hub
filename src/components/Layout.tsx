
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar, ChartBar, Plus, Search, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, onClick }) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 mb-1",
          active ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50"
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    if (path === currentPath) return; // Prevent re-navigation to the same page
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="font-bold text-xl text-primary">FitTrack</div>
        <Button variant="outline" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </Button>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 border-r shrink-0 flex-col p-4 h-screen">
        <div className="font-bold text-2xl mb-8 flex items-center space-x-2 text-primary">
          <span className="text-3xl">🏋️</span>
          <span>FitTrack</span>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem
            to="/"
            icon={<ChartBar className="w-5 h-5" />}
            label="Dashboard"
            active={currentPath === "/"}
            onClick={() => handleNavigation("/")}
          />
          <NavItem
            to="/calendar"
            icon={<Calendar className="w-5 h-5" />}
            label="Calendar"
            active={currentPath === "/calendar"}
            onClick={() => handleNavigation("/calendar")}
          />
          <NavItem
            to="/search"
            icon={<Search className="w-5 h-5" />}
            label="Search"
            active={currentPath === "/search"}
            onClick={() => handleNavigation("/search")}
          />
          <NavItem
            to="/achievements"
            icon={<Award className="w-5 h-5" />}
            label="Achievements"
            active={currentPath === "/achievements"}
            onClick={() => handleNavigation("/achievements")}
          />
        </nav>

        <div className="mt-auto">
          <Link to="/add-workout" onClick={() => handleNavigation("/add-workout")}>
            <Button className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Workout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10">
        <Link to="/" className="flex flex-col items-center px-3 py-1" onClick={(e) => { e.preventDefault(); handleNavigation("/"); }}>
          <ChartBar className={cn("w-5 h-5", currentPath === "/" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/" ? "text-primary" : "text-gray-500")}>Home</span>
        </Link>
        <Link to="/calendar" className="flex flex-col items-center px-3 py-1" onClick={(e) => { e.preventDefault(); handleNavigation("/calendar"); }}>
          <Calendar className={cn("w-5 h-5", currentPath === "/calendar" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/calendar" ? "text-primary" : "text-gray-500")}>Calendar</span>
        </Link>
        <Link to="/add-workout" className="flex flex-col items-center px-3 py-1" onClick={(e) => { e.preventDefault(); handleNavigation("/add-workout"); }}>
          <div className="bg-primary rounded-full p-2 -mt-8">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs mt-1">Add</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center px-3 py-1" onClick={(e) => { e.preventDefault(); handleNavigation("/search"); }}>
          <Search className={cn("w-5 h-5", currentPath === "/search" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/search" ? "text-primary" : "text-gray-500")}>Search</span>
        </Link>
        <Link to="/achievements" className="flex flex-col items-center px-3 py-1" onClick={(e) => { e.preventDefault(); handleNavigation("/achievements"); }}>
          <Award className={cn("w-5 h-5", currentPath === "/achievements" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/achievements" ? "text-primary" : "text-gray-500")}>Achievements</span>
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto pb-16 lg:pb-8">{children}</main>
    </div>
  );
};

export default Layout;
