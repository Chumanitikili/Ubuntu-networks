
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "./DashboardHeader";
import { CallsChart } from "./CallsChart";
import { ActiveCallsList } from "./ActiveCallsList";
import { RecentCallsList } from "./RecentCallsList";
import { AgentsList } from "./AgentsList";
import { AIAssistantCard } from "./AIAssistantCard";
import { InboundSimulator } from "../CallCenter/InboundSimulator";
import { CallWorkflow } from "../CallCenter/CallWorkflow";
import { 
  sampleAgents,
  sampleCalls,
  sampleDashboardStats, 
  sampleAIAssistants
} from "@/utils/sample-data";
import { Button } from "@/components/ui/button";
import { Building2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, isSuperAdmin, isAdmin, profile, switchRole } = useAuth();
  const navigate = useNavigate();
  const [customerView, setCustomerView] = useState<string>("all");
  const [licenseDaysLeft, setLicenseDaysLeft] = useState<number | null>(null);
  
  useEffect(() => {
    // In a real app, this would fetch customer and license data from API/database
    const simulatedLicenseDaysLeft = 45;
    setLicenseDaysLeft(simulatedLicenseDaysLeft);
  }, []);

  const handleRoleSwitch = (value: string) => {
    if (value === "admin") {
      switchRole("admin");
    } else if (value === "customer") {
      switchRole("customer");
    } else if (value === "superadmin" && isSuperAdmin) {
      switchRole("superadmin");
    }
  };

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-foreground mb-1">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
        
        {/* Admin controls */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3">
            {licenseDaysLeft !== null && (
              <Badge variant="outline" className="bg-primary/10 py-1.5">
                License: {licenseDaysLeft} days remaining
              </Badge>
            )}
            
            {/* Customer View Selector (for admins) */}
            {isSuperAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">View as:</span>
                <Select value={isSuperAdmin ? "superadmin" : (isAdmin ? "admin" : "customer")} onValueChange={handleRoleSwitch}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button onClick={() => navigate("/accounts")} variant="outline" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span>Manage Accounts</span>
            </Button>
            
            <Button onClick={() => navigate("/users")} variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              <span>Manage Users</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Top stats bar */}
      <div className="zendesk-card p-0 overflow-hidden">
        <DashboardHeader stats={sampleDashboardStats} />
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left column - 3/4 width */}
        <div className="lg:col-span-3 space-y-5">
          <div className="zendesk-card p-5">
            <CallsChart stats={sampleDashboardStats} />
          </div>
          
          <div className="zendesk-card p-5">
            <RecentCallsList calls={sampleCalls} />
          </div>
        </div>
        
        {/* Right column - 1/4 width */}
        <div className="space-y-5">
          <div className="zendesk-card p-5">
            <ActiveCallsList calls={sampleCalls} />
          </div>
          
          <div className="zendesk-card p-5">
            <AIAssistantCard assistant={sampleAIAssistants[0]} />
          </div>
          
          <div className="zendesk-card p-5">
            <InboundSimulator />
          </div>
        </div>
      </div>
      
      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="zendesk-card p-5">
          <AgentsList agents={sampleAgents} />
        </div>
        
        <div className="zendesk-card p-5">
          <CallWorkflow />
        </div>
      </div>
    </div>
  );
}
