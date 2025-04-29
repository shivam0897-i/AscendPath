import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
// Import the supabase client
import { supabase } from "@/integrations/supabase/client";
// Import useAuth to get user ID (assuming you have an auth context)
import { useAuth } from "@/context/AuthContext"; // Adjust path if needed

const OnboardingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  goal: z.string().min(10, { message: "Please describe your goal in more detail." }),
  field: z.string().min(1, { message: "Please select a field." }),
  background: z.string().min(1, { message: "Please select your background." }),
  experience: z.string().min(1, { message: "Please select your experience level." }),
  timeCommitment: z.number().min(1).max(40),
  challenges: z.string().optional(),
  timeline: z.string().min(1, { message: "Please select a timeline." }),
});

type OnboardingValues = z.infer<typeof OnboardingSchema>;

const fields = [
  { value: "tech", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "arts", label: "Arts & Design" },
  { value: "science", label: "Science" },
  { value: "other", label: "Other" },
];

const backgrounds = [
  { value: "high_school", label: "High School" },
  { value: "some_college", label: "Some College" },
  { value: "associate", label: "Associate's Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate" },
  { value: "self_taught", label: "Self-taught" },
];

const experienceLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const timelines = [
  { value: "3_months", label: "3 months" },
  { value: "6_months", label: "6 months" },
  { value: "1_year", label: "1 year" },
  { value: "2_years", label: "2 years" },
  { value: "3_plus_years", label: "3+ years" },
];

// --- Helper function to map timeline value to label ---
const getTimelineLabel = (value: string) => timelines.find(t => t.value === value)?.label || value;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const { user } = useAuth(); // Get user from auth context
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: "",
      email: user?.email || "", // Pre-fill email if available
      goal: "",
      field: "",
      background: "",
      experience: "",
      timeCommitment: 10,
      challenges: "",
      timeline: "",
    },
  });

  // Initialize default email value if user exists
  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
  }, [user, form]);


  const nextStep = async () => {
    const currentStepFields = {
      1: ["name", "email"],
      2: ["goal", "field"],
      3: ["background", "experience", "timeCommitment"],
      4: ["challenges", "timeline"],
    }[step] as Array<keyof OnboardingValues>;

    const isValid = await form.trigger(currentStepFields);

    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        // Submit the form
        await onSubmit(form.getValues()); // Make onSubmit async
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Make onSubmit async to handle Supabase interaction
  const onSubmit = async (data: OnboardingValues) => {
    if (!user) {
      toast.error("You must be logged in to save your profile.");
      console.error("User not found for profile submission.");
      // Optionally redirect to login: navigate('/auth');
      return;
    }

    setIsSubmitting(true); // Set submitting state

    // Map form data to Supabase 'profiles' table structure
    const fieldOfInterest = fields.find(f => f.value === data.field)?.label || data.field;
    const timelineLabel = getTimelineLabel(data.timeline);

    const profileData = {
      id: user.id, // Use the authenticated user's ID
      first_name: data.name.split(' ')[0], // Basic split for first name
      last_name: data.name.split(' ').slice(1).join(' ') || null, // Basic split for last name
      email: data.email,
      goals: [`Learn about ${fieldOfInterest}`, `Achieve goal: ${data.goal} within ${timelineLabel}`],
      skills: [`Field: ${fieldOfInterest}`, `Experience: ${data.experience}`],
      background: data.background,
      time_available: `${data.timeCommitment} hours/week`,
      ...(data.challenges && { challenges: data.challenges }),
      updated_at: new Date().toISOString(),
    };

    let profileSaved = false; // Flag to track if profile save was successful

    try {
      console.log("Submitting profile data to Supabase:", profileData);

      // Upsert profile data into Supabase
      const { data: savedProfile, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error("Supabase profile save error details:", error);
        throw error;
      }

      console.log("Profile saved successfully:", savedProfile);
      toast.success("Your profile has been saved!");
      profileSaved = true; // Mark profile as saved

      // --- Trigger backend roadmap generation --- 
      if (profileSaved) { // Only trigger if profile save was successful
        console.log("Triggering roadmap generation function...");
        try {
          const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-roadmap', {
            // Pass the userId in the body
            body: JSON.stringify({ userId: user.id })
          });

          if (functionError) {
              // Throw function-specific error to be caught by the outer catch block
              // or handle it specifically here
              throw functionError;
          }

          console.log('Roadmap generation function invoked successfully:', functionData);
          // Inform user generation started, but don't block navigation
          toast.info("Generating your personalized roadmap in the background...");

        } catch (functionError: any) {
          // Catch errors specifically from the function invocation
          console.error("Roadmap generation trigger failed:", functionError);
          toast.error(`Failed to start roadmap generation: ${functionError.message || 'Check function logs.'}`);
          // Decide if you want to proceed to dashboard even if trigger fails
          // Currently, it proceeds because the catch doesn't re-throw or return
        }
      }
      // --------------------------------------------

      // Remove old localStorage data if it exists
      localStorage.removeItem("userData");

      // Navigate to dashboard AFTER attempting to trigger generation
      navigate("/dashboard");

    } catch (error: any) {
      // Catch errors from profile saving or re-thrown function errors
      console.error("Error during profile save or roadmap trigger:", error);
      if (!profileSaved) { // Only show profile save error if it failed
         toast.error(`Failed to save profile: ${error.message || 'Unknown error'}`);
      }
      // Potentially add different error handling if needed
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of success/failure
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar minimal={true} />

      <div className="flex-grow container max-w-3xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Learning Profile</h1>
          <p className="text-gray-600">
            Help us understand your goals and circumstances so we can create your perfect learning path.
          </p>

          <div className="mt-6">
            <Progress value={progress} className="h-2 bg-gray-200" />
            <p className="text-sm text-gray-500 mt-1">Step {step} of {totalSteps}</p>
          </div>
        </div>

        <Card className="shadow-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* --- Form Steps 1-4 (Content unchanged) --- */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4">Tell us about yourself</h2>
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input placeholder="Enter your email" {...field} disabled={!!user?.email} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
                    <FormField control={form.control} name="goal" render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is your educational or career goal?</FormLabel>
                        <FormControl><Textarea placeholder="Describe your goals in detail..." className="min-h-[100px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="field" render={({ field }) => (
                       <FormItem>
                         <FormLabel>Which field are you interested in?</FormLabel>
                         <FormControl>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <SelectTrigger><SelectValue placeholder="Select a field" /></SelectTrigger>
                             <SelectContent>{fields.map((fieldOption) => (<SelectItem key={fieldOption.value} value={fieldOption.value}>{fieldOption.label}</SelectItem>))}</SelectContent>
                           </Select>
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                  </div>
                )}
                {step === 3 && (
                   <div className="space-y-6 animate-fade-in">
                     <h2 className="text-xl font-semibold mb-4">Your Background & Time</h2>
                     <FormField control={form.control} name="background" render={({ field }) => (
                       <FormItem>
                         <FormLabel>What is your educational background?</FormLabel>
                         <FormControl>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <SelectTrigger><SelectValue placeholder="Select your background" /></SelectTrigger>
                             <SelectContent>{backgrounds.map((bg) => (<SelectItem key={bg.value} value={bg.value}>{bg.label}</SelectItem>))}</SelectContent>
                           </Select>
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                     <FormField control={form.control} name="experience" render={({ field }) => (
                       <FormItem>
                         <FormLabel>What is your experience level in your chosen field?</FormLabel>
                         <FormControl>
                           <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                             {experienceLevels.map((level) => (
                               <FormItem key={level.value}>
                                 <FormLabel className="flex items-center space-x-2 space-y-0 cursor-pointer">
                                   <FormControl><RadioGroupItem value={level.value} /></FormControl>
                                   <span>{level.label}</span>
                                 </FormLabel>
                               </FormItem>
                             ))}
                           </RadioGroup>
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                      <FormField control={form.control} name="timeCommitment" render={({ field }) => (
                       <FormItem>
                         <FormLabel>How many hours per week can you commit to learning?<span className="ml-2 text-empowerPurple font-semibold">{field.value} hours</span></FormLabel>
                         <FormControl>
                           <Slider min={1} max={40} step={1} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} className="py-4" />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                  </div>
                )}
                 {step === 4 && (
                   <div className="space-y-6 animate-fade-in">
                     <h2 className="text-xl font-semibold mb-4">Almost there!</h2>
                     <FormField control={form.control} name="challenges" render={({ field }) => (
                       <FormItem>
                         <FormLabel>What challenges might you face in achieving your goals? (Optional)</FormLabel>
                         <FormControl><Textarea placeholder="Financial constraints, time limitations, lack of specific resources..." className="min-h-[100px]" {...field} /></FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                     <FormField control={form.control} name="timeline" render={({ field }) => (
                       <FormItem>
                         <FormLabel>What is your target timeline for achieving your goal?</FormLabel>
                         <FormControl>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <SelectTrigger><SelectValue placeholder="Select a timeline" /></SelectTrigger>
                             <SelectContent>{timelines.map((time) => (<SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>))}</SelectContent>
                           </Select>
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                  </div>
                 )}

                {/* --- Navigation Buttons (Unchanged) --- */}
                <div className="flex justify-between pt-4">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <Button type="button" onClick={nextStep} className="bg-empowerPurple hover:bg-empowerPurple-dark" disabled={isSubmitting}>
                    {isSubmitting ? ("Saving...") : step === totalSteps ? (<><Check className="mr-2 h-4 w-4" /> Complete</>) : (<>Next <ArrowRight className="ml-2 h-4 w-4" /></>)}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
