
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth/AuthForm";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Check if auth check is complete (!isLoading) and user exists
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup");
  };

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  // Render loading indicator or null while checking/redirecting
  if (isLoading || user) {
     return (
        <div className="min-h-screen flex items-center justify-center">
            {/* Optional: Add a loading spinner here */}
        </div>
     );
  }

  // Render the login/signup form if not loading and no user
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar minimal />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-warm-gradient relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-2xl shadow-warm-lg border border-terracotta/10 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold gradient-text">AscendPath</h2>
            <p className="mt-2 text-muted-foreground">
              {activeTab === "login"
                ? "Welcome back to your journey"
                : "Begin your learning adventure"}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-cream/50 dark:bg-charcoal/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <AuthForm mode="login" onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="signup">
              <AuthForm mode="signup" onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
