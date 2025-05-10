import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall } from '../contexts/CallContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";
import { formatDistanceToNow } from 'date-fns';

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-500';
    case 'completed':
      return 'bg-blue-500';
    case 'missed':
      return 'bg-red-500';
    case 'scheduled':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useCall();
  const { user } = useAuth();
  const [licenseProgress] = useState(65);

  const totalCalls = state.callHistory.length + state.activeCalls.length;
  const completedCalls = state.callHistory.filter(call => call.status === 'completed').length;
  const missedCalls = state.callHistory.filter(call => call.status === 'missed').length;
  const scheduledCalls = state.scheduledCalls.length;

  const stats = [
    {
      title: 'Total Calls',
      value: totalCalls,
      description: `${completedCalls} completed, ${missedCalls} missed`,
      icon: Icons.phone
    },
    {
      title: 'Active Calls',
      value: state.activeCalls.length,
      description: 'Currently in progress',
      icon: Icons.activity
    },
    {
      title: 'Scheduled',
      value: scheduledCalls,
      description: 'Upcoming calls',
      icon: Icons.calendar
    },
  ];

  useEffect(() => {
    if (state.activeCalls.length > 0) {
      toast.info('New incoming call', {
        description: `Call from ${state.activeCalls[0].customerName}`,
        action: {
          label: 'View',
          onClick: () => navigate('/calls')
        }
      });
    }
  }, [state.activeCalls.length]);

  return (
    <div className="space-y-4 p-8">
      {/* License Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            License Status
          </CardTitle>
          <CardDescription>
            Trial License - {Math.floor(90 - (licenseProgress / 100 * 90))} days remaining
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={licenseProgress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>{licenseProgress}% Used</span>
            <span>90 Days Total</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon && (
                <div className="h-4 w-4 text-muted-foreground">
                  {stat.icon}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Calls</CardTitle>
            <Button variant="outline" onClick={() => navigate('/calls')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...state.activeCalls, ...state.callHistory]
                  .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
                  .slice(0, 10)
                  .map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${call.customerName}`} />
                            <AvatarFallback>{call.customerName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{call.customerName}</span>
                            <span className="text-sm text-muted-foreground">
                              {call.company}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={call.type === 'inbound' ? 'default' : 'secondary'}>
                          {call.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(call.status)}`} />
                          {call.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(call.startTime, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
