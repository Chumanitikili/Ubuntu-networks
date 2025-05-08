
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  CalendarPlus,
  PhoneOutgoing,
  HelpCircle,
  User,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="border-b bg-background p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tickets, users, or conversations..." className="pl-9 bg-white border-border/40" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Create button (common in Zendesk) */}
          <Button size="sm" className="gap-1 bg-accent hover:bg-accent/90 text-white">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Create</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:bg-muted/20">
            <PhoneOutgoing className="h-4 w-4 text-accent" />
            <span className="hidden md:inline">New Call</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:bg-muted/20">
            <CalendarPlus className="h-4 w-4 text-accent" />
            <span className="hidden md:inline">Schedule</span>
          </Button>
          
          {/* Zendesk-style icon buttons */}
          <div className="border-l border-border/40 h-8 mx-1 hidden md:block"></div>
          
          <Button variant="ghost" size="icon" className="relative hover:bg-muted/20">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative hover:bg-muted/20">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 bg-destructive rounded-full w-2 h-2"></span>
          </Button>
          
          {/* User avatar (Zendesk style) */}
          <Button variant="ghost" size="icon" className="hover:bg-muted/20">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
              <User className="h-5 w-5" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
