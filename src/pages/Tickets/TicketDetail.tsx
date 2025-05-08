
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, MessageSquare, User, Clock, Tag, Paperclip,
  CheckCircle, AlertCircle, Trash, Edit, Copy, Phone,
  MoreHorizontal, Send, ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { Header } from "@/components/Navigation/Header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

// Mock ticket data
const ticket = {
  id: "TICK-1234",
  subject: "Cannot access my account after password reset",
  status: "open",
  priority: "high",
  requester: "Karen Smith",
  requesterEmail: "karen.smith@example.com",
  requesterPhone: "+1 (555) 123-4567",
  assignee: "John Doe",
  assigneeEmail: "john.doe@smartcallnexus.com",
  assigneeAvatar: "",
  created: "2023-05-07T10:23:00",
  updated: "2023-05-07T14:45:00",
  channel: "email",
  tags: ["account", "password", "urgent"],
  messages: [
    {
      id: "msg-1",
      type: "customer",
      sender: "Karen Smith",
      senderEmail: "karen.smith@example.com",
      content: "Hello, I recently requested a password reset but now I can't access my account. I keep getting an 'incorrect password' error even though I'm following the instructions in the email. Can you please help me regain access?",
      timestamp: "2023-05-07T10:23:00",
      attachments: []
    },
    {
      id: "msg-2",
      type: "agent",
      sender: "John Doe",
      senderEmail: "john.doe@smartcallnexus.com",
      content: "Hi Karen, I'm sorry to hear you're having trouble accessing your account. Could you please confirm if you're using the same email address for the password reset as the one you initially registered with? Also, when did you request the password reset?",
      timestamp: "2023-05-07T11:15:00",
      attachments: []
    },
    {
      id: "msg-3",
      type: "customer",
      sender: "Karen Smith",
      senderEmail: "karen.smith@example.com",
      content: "Yes, I'm using the same email address (karen.smith@example.com). I requested the reset about an hour ago and clicked the link right away. The page allowed me to create a new password, and it said it was successful, but then when I try to log in with the new password, it doesn't work.",
      timestamp: "2023-05-07T11:32:00",
      attachments: []
    },
    {
      id: "msg-4",
      type: "note",
      sender: "John Doe",
      senderEmail: "john.doe@smartcallnexus.com",
      content: "I've checked the user's account in the admin panel. It looks like there may be a caching issue between our auth service and database. I'll clear the cached credentials and have them try again.",
      timestamp: "2023-05-07T11:45:00",
      isPrivate: true,
      attachments: []
    }
  ]
};

export function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the reply to the backend
    alert(`Reply submitted: ${replyContent}`);
    setReplyContent("");
  };
  
  const toggleNoteMode = () => {
    setIsAddingNote(!isAddingNote);
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-muted/10">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            {/* Ticket header */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 mr-2"
                  onClick={() => navigate("/tickets")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to tickets</span>
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-medium mb-1">{ticket.subject}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{ticket.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> 
                      {ticket.channel === 'email' ? 'Email Conversation' : 
                       ticket.channel === 'phone' ? 'Phone Call' : 
                       ticket.channel === 'chat' ? 'Web Chat' : 'Conversation'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(ticket.created).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select defaultValue={ticket.status}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="solved">Solved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        <span>Copy Ticket ID</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2" />
                        <span>Call Customer</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        <span>Edit Ticket</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        <span>Delete Ticket</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - conversation */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-background rounded-md border shadow-sm">
                  <Tabs defaultValue="conversation">
                    <div className="border-b">
                      <TabsList className="border-0">
                        <TabsTrigger value="conversation">
                          <MessageSquare className="h-4 w-4 mr-2" /> Conversation
                        </TabsTrigger>
                        <TabsTrigger value="timeline">
                          <Clock className="h-4 w-4 mr-2" /> Timeline
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="conversation" className="m-0 p-0">
                      <div className="divide-y">
                        {ticket.messages.map((message) => (
                          <div 
                            key={message.id}
                            className={`p-6 ${message.type === 'note' ? 'bg-muted/20' : ''}`}
                          >
                            <div className="flex justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage 
                                    src="" 
                                    alt={message.sender}
                                  />
                                  <AvatarFallback className={
                                    message.type === 'agent' ? "bg-primary/10 text-primary" : 
                                    message.type === 'note' ? "bg-secondary/10 text-secondary" :
                                    "bg-muted"
                                  }>
                                    {message.sender.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium flex items-center gap-2">
                                    {message.sender}
                                    {message.type === 'agent' && (
                                      <Badge variant="outline" className="text-xs">Agent</Badge>
                                    )}
                                    {message.type === 'note' && (
                                      <Badge variant="secondary" className="text-xs">Internal Note</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {message.senderEmail}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(message.timestamp).toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="pl-11">
                              <div className="prose prose-sm max-w-none">
                                {message.content}
                              </div>
                              
                              {message.attachments?.length > 0 && (
                                <div className="mt-4">
                                  <div className="text-sm font-medium mb-2">Attachments:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {message.attachments.map((attachment, i) => (
                                      <div key={i} className="border rounded p-2 text-sm flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                        <span>{attachment.filename}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-4 flex gap-2">
                                {message.type !== 'note' && (
                                  <Button variant="ghost" size="sm">
                                    <ArrowRight className="h-3 w-3 mr-1" />
                                    <span>Reply</span>
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Add time</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Reply form */}
                      <div className="p-6 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <h3 className="font-medium">
                              {isAddingNote ? "Add internal note" : "Reply to customer"}
                            </h3>
                            <Button 
                              variant="link" 
                              className="text-xs"
                              onClick={toggleNoteMode}
                            >
                              {isAddingNote ? "Switch to reply" : "Switch to note"}
                            </Button>
                          </div>
                          
                          {!isAddingNote && (
                            <Select defaultValue="default">
                              <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Select template" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">Default Reply</SelectItem>
                                <SelectItem value="password">Password Reset Help</SelectItem>
                                <SelectItem value="login">Login Assistance</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        
                        <form onSubmit={handleSubmitReply}>
                          <div className="space-y-4">
                            <Textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder={isAddingNote ? "Add a private note..." : "Type your reply..."}
                              rows={5}
                              className="resize-none"
                            />
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm">
                                  <Paperclip className="h-4 w-4 mr-1" />
                                  <span>Add attachment</span>
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {!isAddingNote && (
                                  <Select defaultValue="open">
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Open</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="solved">Solved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                                <Button type="submit">
                                  {isAddingNote ? (
                                    <>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      <span>Add note</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      <span>Send reply</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm">Ticket created via Email</div>
                            <div className="text-xs text-muted-foreground">May 7, 2023, 10:23 AM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm">Assigned to John Doe</div>
                            <div className="text-xs text-muted-foreground">May 7, 2023, 10:45 AM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Tag className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm">Tags added: account, password, urgent</div>
                            <div className="text-xs text-muted-foreground">May 7, 2023, 10:50 AM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm">John Doe replied to ticket</div>
                            <div className="text-xs text-muted-foreground">May 7, 2023, 11:15 AM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm">Karen Smith replied to ticket</div>
                            <div className="text-xs text-muted-foreground">May 7, 2023, 11:32 AM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-secondary" />
                          </div>
                          <div>
                            <div className="text-sm">John Doe added an internal note</div>
                            <div className="text-xs text-muted-foreground">May 7, 2023, 11:45 AM</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              
              {/* Right column - ticket details */}
              <div className="space-y-6">
                {/* Customer card */}
                <div className="bg-background rounded-md border shadow-sm p-5">
                  <h3 className="text-sm font-medium mb-4">Customer</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={ticket.requester} />
                      <AvatarFallback>
                        {ticket.requester.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ticket.requester}</div>
                      <div className="text-sm text-muted-foreground">{ticket.requesterEmail}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Phone:</span> {ticket.requesterPhone}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total tickets:</span> 3
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <User className="h-4 w-4 mr-2" />
                      <span>View customer</span>
                    </Button>
                  </div>
                </div>
                
                {/* Ticket details card */}
                <div className="bg-background rounded-md border shadow-sm p-5">
                  <h3 className="text-sm font-medium mb-4">Details</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <div className="col-span-2">
                        <Badge variant={
                          ticket.status === 'open' ? 'default' : 
                          ticket.status === 'pending' ? 'secondary' : 
                          'outline'
                        }>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-muted-foreground">Priority</span>
                      <div className="col-span-2">
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
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-muted-foreground">Channel</span>
                      <div className="col-span-2 capitalize">
                        {ticket.channel}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <div className="col-span-2">
                        {new Date(ticket.created).toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-muted-foreground">Updated</span>
                      <div className="col-span-2">
                        {new Date(ticket.updated).toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-muted-foreground">Tags</span>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {ticket.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="capitalize">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Assignee card */}
                <div className="bg-background rounded-md border shadow-sm p-5">
                  <h3 className="text-sm font-medium mb-4">Assignee</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={ticket.assignee} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {ticket.assignee.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ticket.assignee}</div>
                      <div className="text-sm text-muted-foreground">{ticket.assigneeEmail}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <span>Reassign</span>
                    </Button>
                  </div>
                </div>
                
                {/* Quick actions card */}
                <div className="bg-background rounded-md border shadow-sm p-5">
                  <h3 className="text-sm font-medium mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Mark as Solved</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Set High Priority</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Add Time Entry</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TicketDetail;
