
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
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
      <div className="flex items-center justify-between px-3 py-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
          <Phone className="h-5 w-5 text-sidebar-primary" />
          <h2 className="font-bold text-lg text-sidebar-foreground">Smart Call Nexus</h2>
        </div>
        
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground hover:bg-sidebar-accent/20">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 p-3">
        <NavItem icon={<Home />} label="Dashboard" isCollapsed={isCollapsed} isActive={true} />
        <NavItem icon={<Phone />} label="Call Center" isCollapsed={isCollapsed} />
        <NavItem icon={<Users />} label="Agents" isCollapsed={isCollapsed} />
        <NavItem icon={<MessageCircle />} label="Leads" isCollapsed={isCollapsed} />
        <NavItem icon={<Calendar />} label="Appointments" isCollapsed={isCollapsed} />
        <NavItem icon={<BarChart2 />} label="Analytics" isCollapsed={isCollapsed} />
        <NavItem icon={<Bot />} label="AI Assistant" isCollapsed={isCollapsed} />
        <NavItem icon={<Settings />} label="Settings" isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
}

function NavItem({ icon, label, isCollapsed, isActive }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start py-2 px-3 transition-all hover:bg-sidebar-accent/20",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
      )}
    >
      <span className="mr-2">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Button>
  );
}
