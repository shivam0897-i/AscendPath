
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
      console.log("User already logged in, redirecting to dashboard.");
      navigate("/dashboard");
    }
    // Dependency array includes isLoading and user
  }, [user, isLoading, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup");
  };

  const handleSuccess = () => {
    console.log("Auth successful, navigating to dashboard.");
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

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold gradient-text">AscendPath</h2>
            <p className="mt-2 text-gray-600">
              {activeTab === "login"
                ? "Log in to your account"
                : "Create a new account"}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
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
