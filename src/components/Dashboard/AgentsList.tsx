
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/utils/types";
import { formatDuration, getAgentStatusColor } from "@/utils/format-utils";

interface AgentsListProps {
  agents: Agent[];
}

export function AgentsList({ agents }: AgentsListProps) {
  const availableAgents = agents.filter(agent => agent.status !== 'offline');
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Available Agents</CardTitle>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availableAgents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback className="bg-primary/10">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className={`flex items-center gap-1 ${getAgentStatusColor(agent.status)}`}>
                      <span className="h-2 w-2 rounded-full bg-current"></span>
                      <span>{agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}</span>
                    </div>
                    {agent.activeCalls > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-call-active">{agent.activeCalls} active</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {agent.skills.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="outline" className="whitespace-nowrap text-xs">
                    {skill}
                  </Badge>
                ))}
                {agent.skills.length > 2 && (
                  <Badge variant="outline" className="whitespace-nowrap text-xs">
                    +{agent.skills.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {availableAgents.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No agents available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
