
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Login attempt with:", email);
      await signIn(email, password);
      // Success toast will be shown in AuthContext after successful login
    } catch (error: any) {
      console.error("Login form error:", error);
      toast.error("Login failed", {
        description: error?.message || "Please check your credentials and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test account information for easy access
  const adminInfo = { email: "admin@smartcallnexus.com", password: "Admin123!" };
  const testUserInfo = { email: "testuser@example.com", password: "User123!" };

  const fillTestCredentials = (userType: "admin" | "test") => {
    if (userType === "admin") {
      setEmail(adminInfo.email);
      setPassword(adminInfo.password);
    } else {
      setEmail(testUserInfo.email);
      setPassword(testUserInfo.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-sidebar-accent rounded-md p-2">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-medium text-xl ml-2">Smart Call Nexus</h2>
          </div>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-2">Quick Login:</div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-xs flex-1"
                  onClick={() => fillTestCredentials("admin")}
                >
                  Admin Login
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-xs flex-1"
                  onClick={() => fillTestCredentials("test")}
                >
                  Test User Login
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full mb-4" 
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;
