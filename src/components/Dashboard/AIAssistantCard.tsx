
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bot, Settings } from "lucide-react";
import { AIAssistant } from "@/utils/types";

interface AIAssistantCardProps {
  assistant: AIAssistant;
}

export function AIAssistantCard({ assistant }: AIAssistantCardProps) {
  const usagePercentage = Math.round((assistant.usedMinutes / assistant.maxMinutes) * 100);
  
  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI Assistant</span>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">{assistant.name}</h4>
              <p className="text-sm text-muted-foreground">{assistant.voice}</p>
            </div>
            <div className="ml-auto">
              <Switch checked={assistant.isActive} />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usage</span>
              <span className="font-medium">{assistant.usedMinutes} / {assistant.maxMinutes} minutes</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
          
          <div className="rounded-lg border p-3 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Prompt: "{assistant.prompt.length > 80 ? assistant.prompt.substring(0, 80) + '...' : assistant.prompt}"
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" size="sm">Edit Assistant</Button>
            <Button className="gap-1" size="sm">
              <Bot className="h-4 w-4" />
              Test Voice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
