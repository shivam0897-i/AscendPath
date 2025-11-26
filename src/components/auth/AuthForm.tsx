import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "../ui/google-icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type AuthFormProps = {
  mode: "login" | "signup";
  onSuccess?: () => void;
};

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;


export const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, signInWithGoogle, isLoading } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
  });

  const currentForm = mode === "login" ? loginForm : signupForm;

  const onSubmit = async (values: LoginFormValues | SignupFormValues) => {
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(values.email, values.password);
        if (error) {
          toast({
            title: "Login failed",
            description: error.message || "Please check your credentials and try again",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
            duration: 1000,
          });
          if (onSuccess) {
            onSuccess();
          }
        }
      } else {
        // It's signup
        const signupValues = values as SignupFormValues;
        const { error } = await signUp(
          signupValues.email,
          signupValues.password,
          signupValues.firstName,
          signupValues.lastName
        );
        if (error) {
          toast({
            title: "Signup failed",
            description: error.message || "There was an error creating your account",
            variant: "destructive",
          });
        } else {
          // Toast for signup is handled in AuthContext
          if (onSuccess) {
            onSuccess();
          }
        }
      }

    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
      setIsSubmitting(true); 
      try {
          await signInWithGoogle();
          
      } catch (error) {
           // Errors are handled within signInWithGoogle using toast
      } finally {
           
      }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {mode === "login" ? (
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} disabled={isLoading || isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Login Button */}
            <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta-dark shadow-warm" disabled={isLoading || isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>

            {/* Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button variant="outline" type="button" className="w-full border-charcoal/20 hover:border-terracotta hover:text-terracotta" onClick={handleGoogleSignIn} disabled={isLoading || isSubmitting}>
                {isLoading ? 'Processing...' : <><GoogleIcon/> Google</>}
            </Button>

          </form>
        </Form>
      ) : (
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSubmit as any)} className="space-y-6">
            {/* First Name and Last Name Fields */}
             <div className="grid grid-cols-2 gap-4">
              <FormField
                control={signupForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} disabled={isLoading || isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} disabled={isLoading || isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Field */}
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} disabled={isLoading || isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={signupForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Create Account Button */}
            <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta-dark shadow-warm" disabled={isLoading || isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>

            {/* Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button variant="outline" type="button" className="w-full border-charcoal/20 hover:border-terracotta hover:text-terracotta" onClick={handleGoogleSignIn} disabled={isLoading || isSubmitting}>
               {isLoading ? 'Processing...' : <><GoogleIcon /> Google</>}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
