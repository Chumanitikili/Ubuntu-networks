
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

export default function Dashboard() {
  return (
    <div className="p-5 md:p-6 space-y-6">
      <h1 className="text-2xl font-medium text-foreground mb-4 hidden md:block">Welcome to Smart Call Nexus</h1>
      
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
