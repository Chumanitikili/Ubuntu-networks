
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  CalendarPlus,
  PhoneOutgoing,
  Sun,
  Moon
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="border-b bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search calls, leads..." className="pl-8 bg-muted/50 focus-within:bg-background" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1 hover-card">
            <CalendarPlus className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">Schedule</span>
          </Button>
          <Button size="sm" className="gap-1 hover-card bg-primary hover:bg-primary/90">
            <PhoneOutgoing className="h-4 w-4" />
            <span className="hidden sm:inline">New Call</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative hover-card">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 bg-destructive rounded-full w-2 h-2"></span>
          </Button>
          <Button variant="ghost" size="icon" className="hover-card">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
