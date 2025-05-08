
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneCall, Phone, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function InboundSimulator() {
  const [callerName, setCallerName] = useState("");
  const [callerNumber, setCallerNumber] = useState("");
  const [callerCompany, setCallerCompany] = useState("");
  const [callType, setCallType] = useState("b2c");
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleSimulateCall = () => {
    if (!callerName || !callerNumber) {
      toast({
        title: "Missing information",
        description: "Please provide caller name and number",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);
    
    // Simulate call processing
    setTimeout(() => {
      toast({
        title: "Inbound call received",
        description: `Call from ${callerName} (${callerNumber}) is being processed`,
      });
      
      // Simulate AI assistant response
      setTimeout(() => {
        toast({
          title: "AI Assistant Responding",
          description: "Nova is greeting the caller and identifying their needs",
        });
        
        // Simulate call routing
        setTimeout(() => {
          toast({
            title: "Call Routed",
            description: "Call has been routed to available agent Jane Cooper",
            variant: "default",
          });
          setIsSimulating(false);
        }, 2000);
      }, 1500);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-nexus-primary" />
          Inbound Call Simulator
        </CardTitle>
        <CardDescription>
          Simulate an inbound call to test the automated workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="callerName" className="text-sm font-medium">Caller Name</label>
              <Input
                id="callerName"
                placeholder="Enter caller name"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="callerNumber" className="text-sm font-medium">Phone Number</label>
              <Input
                id="callerNumber"
                placeholder="+1XXXXXXXXXX"
                value={callerNumber}
                onChange={(e) => setCallerNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="callType" className="text-sm font-medium">Call Type</label>
              <Select value={callType} onValueChange={setCallType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select call type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2b">Business (B2B)</SelectItem>
                  <SelectItem value="b2c">Consumer (B2C)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="callerCompany" className="text-sm font-medium">Company Name</label>
              <Input
                id="callerCompany"
                placeholder="Enter company name (for B2B)"
                value={callerCompany}
                onChange={(e) => setCallerCompany(e.target.value)}
                disabled={callType !== "b2b"}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          onClick={handleSimulateCall} 
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary-foreground animate-spin"></div>
              Processing Call...
            </>
          ) : (
            <>
              <PhoneCall className="h-4 w-4" />
              Simulate Inbound Call
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
