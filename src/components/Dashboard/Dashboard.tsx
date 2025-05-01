
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
    <div className="space-y-8 p-8">
      <DashboardHeader stats={sampleDashboardStats} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CallsChart stats={sampleDashboardStats} />
        <ActiveCallsList calls={sampleCalls} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RecentCallsList calls={sampleCalls} />
        <AIAssistantCard assistant={sampleAIAssistants[0]} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AgentsList agents={sampleAgents} />
        <div className="space-y-6">
          <InboundSimulator />
          <CallWorkflow />
        </div>
      </div>
    </div>
  );
}
