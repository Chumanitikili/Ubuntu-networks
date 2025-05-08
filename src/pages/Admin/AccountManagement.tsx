
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isAfter } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, AlertCircle, CheckCircle2, Eye, RefreshCw } from "lucide-react";

interface Customer {
  id: string;
  company_name: string;
  admin_email: string;
  license_start_date: string;
  license_end_date: string;
  is_active: boolean;
  admin_notified: boolean;
}

export function AccountManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    company_name: "",
    admin_email: "",
  });
  const { isSuperAdmin, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("company_name");

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error fetching customers",
        description: "Failed to load customer data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomer = async () => {
    try {
      const now = new Date();
      const licenseStart = format(now, "yyyy-MM-dd");
      const licenseEnd = format(addDays(now, 90), "yyyy-MM-dd");

      const { data, error } = await supabase.from("customers").insert({
        company_name: newCustomer.company_name,
        admin_email: newCustomer.admin_email,
        license_start_date: licenseStart,
        license_end_date: licenseEnd,
        is_active: true,
        admin_notified: false,
      }).select();

      if (error) throw error;

      toast({
        title: "Customer added successfully",
        description: `90-day POC license created for ${newCustomer.company_name}`,
      });

      setNewCustomer({ company_name: "", admin_email: "" });
      setShowAddDialog(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        title: "Error adding customer",
        description: "Failed to create customer account",
        variant: "destructive",
      });
    }
  };

  const renewLicense = async (customerId: string) => {
    try {
      const now = new Date();
      const licenseEnd = format(addDays(now, 90), "yyyy-MM-dd");

      await supabase
        .from("customers")
        .update({
          license_end_date: licenseEnd,
          is_active: true,
          admin_notified: false,
        })
        .eq("id", customerId);

      toast({
        title: "License renewed",
        description: "License has been extended for 90 days",
      });

      fetchCustomers();
    } catch (error) {
      console.error("Error renewing license:", error);
      toast({
        title: "Error renewing license",
        description: "Failed to renew license",
        variant: "destructive",
      });
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.company_name.toLowerCase().includes(searchLower) ||
      customer.admin_email.toLowerCase().includes(searchLower)
    );
  });

  const getLicenseStatus = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (isAfter(now, end)) {
      return { status: "expired", label: "Expired", variant: "destructive" };
    } else if (daysLeft <= 7) {
      return { status: "expiring", label: `${daysLeft} days left`, variant: "warning" };
    } else {
      return { status: "active", label: `${daysLeft} days left`, variant: "success" };
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-5 flex flex-col items-center justify-center h-[80vh]">
        <AlertCircle className="text-destructive h-12 w-12 mb-4" />
        <h2 className="text-2xl font-medium mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-medium">Account Management</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Accounts</CardTitle>
          <CardDescription>
            Manage your customer POC licenses. Each license is valid for 90 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin">
                <RefreshCw className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Admin Email</TableHead>
                  <TableHead>License Start</TableHead>
                  <TableHead>License End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchQuery ? "No matching customers found" : "No customers yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const licenseStatus = getLicenseStatus(customer.license_end_date);
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.company_name}</TableCell>
                        <TableCell>{customer.admin_email}</TableCell>
                        <TableCell>
                          {format(new Date(customer.license_start_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(customer.license_end_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={licenseStatus.variant === "success" ? "outline" : "destructive"}>
                            {licenseStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => renewLicense(customer.id)}
                            >
                              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Renew
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Add Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer account with a 90-day POC license.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company Name
              </label>
              <Input
                id="company"
                value={newCustomer.company_name}
                onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Admin Email
              </label>
              <Input
                id="email"
                type="email"
                value={newCustomer.admin_email}
                onChange={(e) => setNewCustomer({ ...newCustomer, admin_email: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addCustomer}
              disabled={!newCustomer.company_name || !newCustomer.admin_email}
            >
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AccountManagement;
