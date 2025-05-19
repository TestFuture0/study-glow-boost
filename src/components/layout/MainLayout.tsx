
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Book, 
  Home, 
  Award, 
  Star, 
  CreditCard, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

type NavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  isPro?: boolean;
  isActive?: boolean;
};

const NavItem = ({ to, icon, label, isPro = false, isActive = false }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "flex w-full items-center justify-start gap-3 px-3",
          isPro && "text-studyspark-purple dark:text-purple-300"
        )}
      >
        {icon}
        <span>{label}</span>
        {isPro && (
          <span className="ml-auto rounded bg-studyspark-purple px-1.5 py-0.5 text-xs text-white">
            PRO
          </span>
        )}
      </Button>
    </Link>
  );
};

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  // Logout function - to be implemented when auth is added
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    // Add actual logout logic when auth is implemented
  };

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow-sm md:hidden dark:bg-slate-900">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-studyspark-purple">StudySpark</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto border-r bg-sidebar p-4 transition-transform duration-300 ease-in-out dark:bg-slate-900",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-studyspark-purple p-2">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold text-studyspark-purple">StudySpark</span>
          </Link>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            <NavItem 
              to="/" 
              icon={<Home size={18} />} 
              label="Dashboard" 
              isActive={location.pathname === "/"} 
            />
            <NavItem 
              to="/flashcards" 
              icon={<Book size={18} />} 
              label="Flashcards" 
              isActive={location.pathname === "/flashcards"} 
            />
            <NavItem 
              to="/quizzes" 
              icon={<Book size={18} />} 
              label="AI Quizzes" 
              isActive={location.pathname === "/quizzes"} 
            />
            <NavItem 
              to="/explain" 
              icon={<Book size={18} />} 
              label="Concept Explainer" 
              isActive={location.pathname === "/explain"} 
              isPro 
            />
            <Separator className="my-2" />
            <NavItem 
              to="/achievements" 
              icon={<Award size={18} />} 
              label="Achievements" 
              isActive={location.pathname === "/achievements"} 
            />
            <NavItem 
              to="/points" 
              icon={<Star size={18} />} 
              label="My Points" 
              isActive={location.pathname === "/points"} 
            />
            <Separator className="my-2" />
            <NavItem 
              to="/pro" 
              icon={<CreditCard size={18} />} 
              label="Upgrade to Pro" 
              isActive={location.pathname === "/pro"} 
            />
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-3 px-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
