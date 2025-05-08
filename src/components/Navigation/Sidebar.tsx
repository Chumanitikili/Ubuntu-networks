
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Phone,
  Users,
  BarChart2,
  Settings,
  Calendar,
  MessageCircle,
  Bot,
  Menu,
  X,
  Home,
  HelpCircle,
  Search,
  Building2,
  ShieldCheck,
  LogOut,
  Ticket,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isSuperAdmin, isAdmin, isCustomer, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r transition-all duration-300 bg-sidebar shadow-md",
        isCollapsed ? "w-[60px]" : "w-[240px]",
        className
      )}
    >
      {/* Logo section */}
      <div className="flex items-center justify-between px-3 py-5 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
          <div className="bg-sidebar-accent rounded-md p-1">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-medium text-lg text-sidebar-foreground">Smart Call Nexus</h2>
        </div>
        
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground hover:bg-sidebar-border/50">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Search bar (Zendesk-like) */}
      {!isCollapsed && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sidebar-foreground/60" />
            <input 
              className="w-full bg-sidebar-border/30 border-0 rounded-md pl-9 pr-3 py-2 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:outline-none focus:ring-1 focus:ring-sidebar-accent"
              placeholder="Search..." 
            />
          </div>
        </div>
      )}
      
      {/* Navigation items */}
      <div className="flex flex-col gap-1 p-2 overflow-y-auto flex-1">
        <NavItem 
          icon={<Home />} 
          label="Dashboard" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname === "/" || location.pathname === "/dashboard"}
          to="/"
        />
        
        <NavItem 
          icon={<Ticket />} 
          label="Tickets" 
          isCollapsed={isCollapsed}
          isActive={location.pathname.startsWith("/tickets")}
          to="/tickets"
        />
        
        {/* Show admin links only for admin users */}
        {isAdmin && (
          <>
            <NavItem 
              icon={<Building2 />} 
              label="Accounts" 
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/accounts"}
              to="/accounts"
            />
          </>
        )}
        
        {/* Show superadmin links only for superadmin users */}
        {isSuperAdmin && (
          <NavItem 
            icon={<ShieldCheck />} 
            label="Super Admin" 
            isCollapsed={isCollapsed}
            isActive={location.pathname === "/super-admin"}
            to="/super-admin"
          />
        )}
        
        {/* Common navigation items */}
        <NavItem icon={<Phone />} label="Call Center" isCollapsed={isCollapsed} to="/call-center" />
        <NavItem icon={<Users />} label="Agents" isCollapsed={isCollapsed} to="/agents" />
        <NavItem icon={<MessageSquare />} label="Conversations" isCollapsed={isCollapsed} to="/conversations" />
        <NavItem icon={<Calendar />} label="Appointments" isCollapsed={isCollapsed} to="/appointments" />
        <NavItem icon={<BarChart2 />} label="Analytics" isCollapsed={isCollapsed} to="/analytics" />
        <NavItem icon={<Bot />} label="AI Assistant" isCollapsed={isCollapsed} to="/ai-assistant" />
        
        {/* Zendesk-like category separator */}
        <div className={cn("mt-4 mb-2 px-3", isCollapsed && "hidden")}>
          <span className="text-xs font-medium uppercase text-sidebar-foreground/50">Settings</span>
        </div>
        
        <NavItem icon={<Settings />} label="Settings" isCollapsed={isCollapsed} to="/settings" />
      </div>
      
      {/* Help section at bottom (Zendesk-like) */}
      <div className="p-2 border-t border-sidebar-border">
        <NavItem icon={<HelpCircle />} label="Help & Support" isCollapsed={isCollapsed} to="/help" />
        <Button
          variant="ghost"
          className={cn(
            "zendesk-sidebar-item w-full justify-start py-2 px-3 text-sidebar-foreground hover:bg-sidebar-hover"
          )}
          onClick={signOut}
        >
          <span className="text-sidebar-foreground"><LogOut className="h-4 w-4" /></span>
          {!isCollapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  to: string;
}

function NavItem({ icon, label, isCollapsed, isActive, to }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "zendesk-sidebar-item w-full justify-start py-2 px-3",
        isActive && "active"
      )}
      asChild
    >
      <Link to={to}>
        <span className="text-current">{icon}</span>
        {!isCollapsed && <span className="ml-2">{label}</span>}
      </Link>
    </Button>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return isMobile;
}
