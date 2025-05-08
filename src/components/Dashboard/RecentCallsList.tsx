
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, PhoneOutgoing, Play, UserRound } from "lucide-react";
import { Call } from "@/utils/types";
import { formatDate, formatDuration, formatPhoneNumber, getCallStatusBadge } from "@/utils/format-utils";

interface RecentCallsListProps {
  calls: Call[];
}

export function RecentCallsList({ calls }: RecentCallsListProps) {
  // Filter for completed and missed calls
  const recentCalls = calls
    .filter(call => call.status === 'completed' || call.status === 'missed')
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 5);
  
  return (
    <Card className="col-span-3 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Calls</CardTitle>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCalls.map((call) => (
            <RecentCallItem key={call.id} call={call} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentCallItemProps {
  call: Call;
}

function RecentCallItem({ call }: RecentCallItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
          {call.status === 'completed' ? (
            <PhoneIncoming className="h-5 w-5 text-primary" />
          ) : (
            <PhoneMissedIcon className="h-5 w-5 text-call-missed" />
          )}
        </div>
        <div>
          <div className="font-medium flex items-center gap-2">
            {call.callerName}
            {call.isB2B && <Badge variant="outline" className="text-xs">B2B</Badge>}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {formatPhoneNumber(call.callerId)}
            {call.agentName && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1">
                  <UserRound className="h-3 w-3" />
                  {call.agentName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={getCallStatusBadge(call.status)}>
          {call.status === 'completed' ? 'Completed' : 'Missed'}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{formatDate(call.startTime)}</span>
          {call.duration && (
            <>
              <span>•</span>
              <span>{formatDuration(call.duration)}</span>
            </>
          )}
        </div>
        {call.recordingUrl && (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Play className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function PhoneMissedIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="m16 2 4 4-4 4"></path>
      <path d="M15 5.5 5.5 15"></path>
      <path d="M19.2 14.8 19 21a2 2 0 0 1-2 2h-2a16 16 0 0 1-15-15v-2a2 2 0 0 1 2-2h6.5"></path>
    </svg>
  );
}
