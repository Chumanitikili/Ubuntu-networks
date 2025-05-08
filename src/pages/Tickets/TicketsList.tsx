
import { useState } from "react";
import { 
  Search, Filter, MessageSquare, Phone, Clock, MoreHorizontal,
  Plus, ChevronDown, ChevronUp, Users, User, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { Header } from "@/components/Navigation/Header";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const tickets = [
  {
    id: "TICK-1234",
    subject: "Cannot access my account after password reset",
    status: "open",
    priority: "high",
    requester: "Karen Smith",
    requesterEmail: "karen.smith@example.com",
    assignee: "John Doe",
    assigneeAvatar: "",
    created: "2023-05-07T10:23:00",
    updated: "2023-05-07T14:45:00",
    channel: "email",
    tags: ["account", "password", "urgent"]
  },
  {
    id: "TICK-1235",
    subject: "Need help with billing cycle adjustment",
    status: "pending",
    priority: "normal",
    requester: "Michael Brown",
    requesterEmail: "michael.brown@example.com",
    assignee: "Sarah Johnson",
    assigneeAvatar: "",
    created: "2023-05-07T09:15:00",
    updated: "2023-05-07T12:30:00",
    channel: "phone",
    tags: ["billing", "adjustment"]
  },
  {
    id: "TICK-1236",
    subject: "Product missing from last shipment",
    status: "open",
    priority: "normal",
    requester: "Laura Wilson",
    requesterEmail: "laura.wilson@example.com",
    assignee: null,
    assigneeAvatar: "",
    created: "2023-05-07T08:45:00",
    updated: "2023-05-07T08:45:00",
    channel: "web",
    tags: ["order", "shipping"]
  },
  {
    id: "TICK-1237",
    subject: "Question about enterprise plan features",
    status: "solved",
    priority: "low",
    requester: "Robert Davis",
    requesterEmail: "robert.davis@acme.com",
    assignee: "John Doe",
    assigneeAvatar: "",
    created: "2023-05-06T15:30:00",
    updated: "2023-05-07T10:15:00",
    channel: "chat",
    tags: ["enterprise", "plan", "features"]
  },
  {
    id: "TICK-1238",
    subject: "Request for refund on damaged product",
    status: "pending",
    priority: "high",
    requester: "Emily Clark",
    requesterEmail: "emily.clark@example.com",
    assignee: "Sarah Johnson",
    assigneeAvatar: "",
    created: "2023-05-06T14:20:00",
    updated: "2023-05-07T09:45:00",
    channel: "email",
    tags: ["refund", "damaged"]
  }
];

export function TicketsList() {
  const { user } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("updated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const handleSelectTicket = (ticketId: string) => {
    if (selectedTickets.includes(ticketId)) {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
    } else {
      setSelectedTickets([...selectedTickets, ticketId]);
    }
  };
  
  const handleSelectAllTickets = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-muted/10">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-medium">Tickets</h1>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                <span>New Ticket</span>
              </Button>
            </div>
            
            <Tabs defaultValue="all" className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all">All Tickets</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned to me</TabsTrigger>
                  <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search tickets..." />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="all" className="m-0">
                <div className="bg-background rounded-md border shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left w-10">
                            <Checkbox 
                              checked={selectedTickets.length === tickets.length && tickets.length > 0}
                              onCheckedChange={handleSelectAllTickets}
                            />
                          </th>
                          <th className="px-4 py-3 text-left">Subject</th>
                          <th className="px-4 py-3 text-left">Requester</th>
                          <th 
                            className="px-4 py-3 text-left cursor-pointer hover:bg-muted/20"
                            onClick={() => handleSort("updated")}
                          >
                            <div className="flex items-center gap-1">
                              Updated
                              {sortField === "updated" && (
                                sortDirection === "desc" ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronUp className="h-4 w-4" />
                              )}
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Assignee</th>
                          <th className="px-4 py-3 text-left">Priority</th>
                          <th className="px-4 py-3 text-left">Channel</th>
                          <th className="px-4 py-3 text-left w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map(ticket => (
                          <tr 
                            key={ticket.id} 
                            className="border-b hover:bg-muted/10 cursor-pointer"
                          >
                            <td className="px-4 py-4">
                              <Checkbox 
                                checked={selectedTickets.includes(ticket.id)}
                                onCheckedChange={() => handleSelectTicket(ticket.id)}
                                onClick={e => e.stopPropagation()}
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-medium">{ticket.subject}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {ticket.id} • Created {new Date(ticket.created).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div>{ticket.requester}</div>
                              <div className="text-xs text-muted-foreground">{ticket.requesterEmail}</div>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              {new Date(ticket.updated).toLocaleString()}
                            </td>
                            <td className="px-4 py-4">
                              <Badge 
                                variant={
                                  ticket.status === 'open' ? 'default' : 
                                  ticket.status === 'pending' ? 'secondary' : 
                                  'outline'
                                }
                              >
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              {ticket.assignee ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={ticket.assigneeAvatar} />
                                    <AvatarFallback className="text-xs">
                                      {ticket.assignee.split(' ').map(name => name[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{ticket.assignee}</span>
                                </div>
                              ) : (
                                <Badge variant="outline">Unassigned</Badge>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <Badge 
                                variant="outline"
                                className={
                                  ticket.priority === 'high' ? 'text-red-500 border-red-200 bg-red-50' : 
                                  ticket.priority === 'normal' ? 'text-amber-500 border-amber-200 bg-amber-50' :
                                  'text-green-500 border-green-200 bg-green-50'
                                }
                              >
                                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                {ticket.channel === 'email' && <MessageSquare className="h-4 w-4 mr-1" />}
                                {ticket.channel === 'phone' && <Phone className="h-4 w-4 mr-1" />}
                                {ticket.channel === 'chat' && <MessageSquare className="h-4 w-4 mr-1" />}
                                <span className="capitalize text-sm">{ticket.channel}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Ticket</DropdownMenuItem>
                                  <DropdownMenuItem>Assign to me</DropdownMenuItem>
                                  <DropdownMenuItem>Change Priority</DropdownMenuItem>
                                  <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="px-4 py-4 border-t flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">5</span> of{" "}
                      <span className="font-medium">24</span> tickets
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="assigned" className="m-0">
                <div className="bg-background rounded-md border shadow-sm p-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground opacity-50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tickets assigned to you</h3>
                  <p className="text-muted-foreground mb-4">Tickets assigned to you will appear here.</p>
                  <Button>Assign a ticket</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="unassigned" className="m-0">
                <div className="bg-background rounded-md border shadow-sm p-8 text-center">
                  <User className="h-10 w-10 text-muted-foreground opacity-50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No unassigned tickets</h3>
                  <p className="text-muted-foreground mb-4">All tickets are currently assigned.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Quick actions */}
            <div className="bg-background rounded-md border p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="gap-1">
                  <User className="h-3 w-3" />
                  <span>Assign Selected</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Mark as Solved</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Set Reminder</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TicketsList;
