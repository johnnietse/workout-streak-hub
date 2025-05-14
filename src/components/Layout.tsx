
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, ChartBar, Plus, Search, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link to={to}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium",
          active 
            ? "bg-primary/10 text-primary" 
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-white h-screen sticky top-0 flex flex-col">
        <div className="p-4">
          <div className="font-bold text-xl mb-8 flex items-center space-x-2 text-primary">
            <span className="text-xl">🏋️</span>
            <span>FitTrack</span>
          </div>

          <nav className="space-y-1 flex-1">
            <NavItem
              to="/"
              icon={<ChartBar className="w-4 h-4" />}
              label="Dashboard"
              active={currentPath === "/"}
            />
            <NavItem
              to="/calendar"
              icon={<Calendar className="w-4 h-4" />}
              label="Calendar"
              active={currentPath === "/calendar"}
            />
            <NavItem
              to="/search"
              icon={<Search className="w-4 h-4" />}
              label="Search"
              active={currentPath === "/search"}
            />
            <NavItem
              to="/achievements"
              icon={<Award className="w-4 h-4" />}
              label="Achievements"
              active={currentPath === "/achievements"}
            />
          </nav>
        </div>

        <div className="mt-auto p-4">
          <Link to="/add-workout">
            <Button className="w-full gap-2 bg-primary">
              <Plus className="w-4 h-4" />
              Add Workout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile navigation - hidden on desktop */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10">
        <Link to="/" className="flex flex-col items-center px-3 py-1">
          <ChartBar className={cn("w-5 h-5", currentPath === "/" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/" ? "text-primary" : "text-gray-500")}>Dashboard</span>
        </Link>
        <Link to="/calendar" className="flex flex-col items-center px-3 py-1">
          <Calendar className={cn("w-5 h-5", currentPath === "/calendar" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/calendar" ? "text-primary" : "text-gray-500")}>Calendar</span>
        </Link>
        <Link to="/add-workout" className="flex flex-col items-center px-3 py-1">
          <div className="bg-primary rounded-full p-2 -mt-6">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs mt-1">Add</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center px-3 py-1">
          <Search className={cn("w-5 h-5", currentPath === "/search" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/search" ? "text-primary" : "text-gray-500")}>Search</span>
        </Link>
        <Link to="/achievements" className="flex flex-col items-center px-3 py-1">
          <Award className={cn("w-5 h-5", currentPath === "/achievements" ? "text-primary" : "text-gray-500")} />
          <span className={cn("text-xs mt-1", currentPath === "/achievements" ? "text-primary" : "text-gray-500")}>Achievements</span>
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 pb-20 lg:pb-8">{children}</main>
    </div>
  );
};

export default Layout;
