
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export type UserRole = "superadmin" | "admin" | "customer";

type Profile = {
  id: string;
  full_name: string;
  customer_id: string | null;
  role: UserRole;
  avatar_url?: string;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, customerID?: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchUserProfile(data.session.user.id);
      }
      
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
          setCurrentRole(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }

    if (data) {
      const userProfile: Profile = {
        id: data.id,
        full_name: data.full_name,
        customer_id: data.customer_id,
        role: data.role as UserRole,
        avatar_url: data.avatar_url,
      };
      
      setProfile(userProfile);
      setCurrentRole(userProfile.role);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        title: "Error signing in",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, customerID?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("user_profiles").insert({
          user_id: data.user.id,
          customer_id: customerID || null,
          full_name: fullName,
          role: customerID ? "customer" : "admin", // Default role based on customer ID
        });

        if (profileError) {
          toast({
            title: "Error creating profile",
            description: profileError.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Account created successfully",
          description: "Please check your email for verification",
        });
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast({
        title: "Error signing up",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const switchRole = (role: UserRole) => {
    if (profile && (profile.role === "superadmin" || (profile.role === "admin" && role === "customer"))) {
      setCurrentRole(role);
      toast({
        title: "Role switched",
        description: `You are now viewing as ${role}`,
      });
      navigate("/dashboard");
    }
  };

  const isSuperAdmin = currentRole === "superadmin";
  const isAdmin = currentRole === "admin" || currentRole === "superadmin";
  const isCustomer = currentRole === "customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isSuperAdmin,
        isAdmin,
        isCustomer,
        isLoading,
        signIn,
        signUp,
        signOut,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
