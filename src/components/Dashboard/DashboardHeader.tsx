
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  Clock,
} from "lucide-react";
import { DashboardStats } from "@/utils/types";
import { formatDuration } from "@/utils/format-utils";

interface DashboardHeaderProps {
  stats: DashboardStats;
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCalls}</div>
          <p className="text-xs text-muted-foreground">Today</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
          <PhoneCall className="h-4 w-4 text-call-active" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-call-active">{stats.activeCalls}</div>
          <p className="text-xs text-muted-foreground">Now</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <PhoneIncoming className="h-4 w-4 text-call-completed" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-call-completed">{stats.completedCalls}</div>
          <p className="text-xs text-muted-foreground">{Math.round(stats.completedCalls / stats.totalCalls * 100)}% completion rate</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Missed Calls</CardTitle>
          <PhoneMissed className="h-4 w-4 text-call-missed" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-call-missed">{stats.missedCalls}</div>
          <p className="text-xs text-muted-foreground">{Math.round(stats.missedCalls / stats.totalCalls * 100)}% missed rate</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDuration(stats.avgCallDuration)}</div>
          <p className="text-xs text-muted-foreground">per call</p>
        </CardContent>
      </Card>
    </div>
  );
}
