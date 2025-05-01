
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
    <div className="space-y-8 p-6 md:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6 hidden md:block">Dashboard</h1>
      
      <DashboardHeader stats={sampleDashboardStats} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CallsChart stats={sampleDashboardStats} />
        <div className="md:col-span-1 space-y-6">
          <ActiveCallsList calls={sampleCalls} />
          <AIAssistantCard assistant={sampleAIAssistants[0]} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentCallsList calls={sampleCalls} />
        </div>
        <div className="space-y-6">
          <InboundSimulator />
          <CallWorkflow />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentsList agents={sampleAgents} />
      </div>
    </div>
  );
}
