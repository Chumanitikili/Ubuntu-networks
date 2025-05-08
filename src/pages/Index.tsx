
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { Header } from "@/components/Navigation/Header";
import Dashboard from "@/components/Dashboard/Dashboard";
import AccountManagement from "@/pages/Admin/AccountManagement";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    // Check if 90 day licenses have expired and notify admins
    const checkLicenses = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Get expired licenses where admin has not been notified yet
        const { data: expiredLicenses } = await supabase
          .from("customers")
          .select("*")
          .lte("license_end_date", today)
          .eq("admin_notified", false)
          .eq("is_active", true);
          
        if (expiredLicenses && expiredLicenses.length > 0) {
          // In a real app, this would send actual emails
          // For demo purposes, we'll just mark them as notified
          expiredLicenses.forEach(async (license) => {
            // Update customer record to show notification was sent
            await supabase
              .from("customers")
              .update({ 
                admin_notified: true,
                is_active: false
              })
              .eq("id", license.id);
              
            console.log(`Notification sent for expired license: ${license.company_name}`);
          });
          
          // Show notification to admin
          toast({
            title: `${expiredLicenses.length} License(s) Expired`,
            description: `Notifications have been sent to ${expiredLicenses.length} customer(s).`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking licenses:", error);
      }
    };
    
    // Run license check when admin logs in
    if (user && !isLoading) {
      checkLicenses();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    
    if (value === "accounts") {
      navigate("/accounts");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {currentTab === "dashboard" && <Dashboard />}
          {currentTab === "accounts" && <AccountManagement />}
        </main>
      </div>
    </div>
  );
};

export default Index;
