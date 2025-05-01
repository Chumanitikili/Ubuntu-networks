
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Call } from "@/utils/types";
import { formatPhoneNumber, formatTime, getCallStatusBadge } from "@/utils/format-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ActiveCallsListProps {
  calls: Call[];
}

export function ActiveCallsList({ calls }: ActiveCallsListProps) {
  // Filter for active and waiting calls only
  const activeCalls = calls.filter(call => call.status === 'active' || call.status === 'waiting')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Live Calls
          <Badge variant="outline" className="ml-2">
            {activeCalls.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeCalls.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No active calls at the moment</p>
        ) : (
          <div className="space-y-4">
            {activeCalls.map((call) => (
              <ActiveCallItem key={call.id} call={call} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ActiveCallItemProps {
  call: Call;
}

function ActiveCallItem({ call }: ActiveCallItemProps) {
  // Calculate time elapsed
  const now = new Date();
  const elapsedMs = now.getTime() - call.startTime.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const elapsedSeconds = Math.floor((elapsedMs % 60000) / 1000);
  const elapsedFormatted = `${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={call.status === 'active' ? 'active-call-animation' : ''}>
          <Avatar className={call.status === 'active' ? 'border-2 border-call-active' : ''}>
            <AvatarImage src="" alt={call.callerName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {call.callerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="font-medium">{call.callerName}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {formatPhoneNumber(call.callerId)}
            {call.callerCompany && (
              <>
                <span className="text-muted-foreground">•</span>
                <span>{call.callerCompany}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className={getCallStatusBadge(call.status)}>
          {call.status === 'active' ? 'In Progress' : 'Waiting'}
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <span className="text-muted-foreground">{formatTime(call.startTime)}</span>
          <span>•</span>
          <span className="font-medium">{elapsedFormatted}</span>
        </div>
      </div>
    </div>
  );
}
