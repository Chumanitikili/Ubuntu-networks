
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  CalendarPlus,
  PhoneOutgoing,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="border-b bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search calls, leads..." className="pl-8" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <CalendarPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </Button>
          <Button size="sm" className="gap-1">
            <PhoneOutgoing className="h-4 w-4" />
            <span className="hidden sm:inline">New Call</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
