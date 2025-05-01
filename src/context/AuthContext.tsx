import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>; 
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false); // Moved isLoading to false after setting user/session
        console.log("Auth state changed:", event, session);
      }
    );

    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false); // Also set isLoading to false here
    };
    checkSession();


    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) {
      console.error("Sign up error:", error.message);
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.user) {
      setUser(data.user);
      setSession(data.session);
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });
       // Optionally handle profile creation here or via a trigger
       if (firstName || lastName) {
          await supabase
            .from('profiles') // Adjust table name if different
            .update({ first_name: firstName, last_name: lastName })
            .eq('id', data.user.id);
       }
    }
    setIsLoading(false);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Sign in error:", error.message);
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.user) {
      setUser(data.user);
      setSession(data.session);
      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
    }
    setIsLoading(false);
    return { error };
  };

  // Add the Google sign-in function
  const signInWithGoogle = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin // Redirect back to your app after Google auth
        }
      });
      if (error) {
        console.error("Google Sign in error:", error.message);
        toast({
          title: "Google Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false); // Stop loading on error
      }
     
    };


  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      setSession(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
    setIsLoading(false);
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle, 
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};