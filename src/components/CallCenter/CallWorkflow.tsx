
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function CallWorkflow() {
  const workflowSteps = [
    {
      title: "Call Received",
      description: "Twilio webhook triggers n8n workflow",
      icon: "📞",
    },
    {
      title: "AI Receptionist",
      description: "Nova greets caller and identifies their needs",
      icon: "🤖",
    },
    {
      title: "CRM Lookup",
      description: "System checks if caller exists in database",
      icon: "🔍",
    },
    {
      title: "Route & Log",
      description: "Call is routed to agent or self-service",
      icon: "🔀",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inbound Call Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {workflowSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl mb-2">
                  {step.icon}
                </div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-[140px]">
                  {step.description}
                </p>
              </div>
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="h-6 w-6 mx-1 md:mx-4 text-muted-foreground shrink-0 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
