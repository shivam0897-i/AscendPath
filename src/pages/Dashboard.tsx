import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Award,
  ArrowRight,
  CheckCheck,
  Info,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import ResourceCard from "@/components/ResourceCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

// --- Types Fetched from Supabase ---
type Profile = Database['public']['Tables']['profiles']['Row'];
type RoadmapFromSupabase = Database['public']['Tables']['roadmaps']['Row'];
type PhaseFromSupabase = Database['public']['Tables']['phases']['Row'];
type MilestoneFromSupabase = Database['public']['Tables']['milestones']['Row'];
type ResourceFromSupabase = Database['public']['Tables']['resources']['Row'];

// Combined type for the state
type FullRoadmapFromSupabase = RoadmapFromSupabase & {
    phases: (PhaseFromSupabase & {
        milestones: (MilestoneFromSupabase & {
            resources: ResourceFromSupabase[];
        })[];
    })[];
};

// --- Types Expected by Components ---
type ResourceForTimeline = Omit<ResourceFromSupabase, 'image_url'> & {
    imageUrl: string | null;
};
type MilestoneForTimeline = Omit<MilestoneFromSupabase, 'estimated_time'> & {
    id: string;
    estimatedTime: string | null;
    completed: boolean;
    resources: ResourceForTimeline[];
};
type PhaseForTimeline = Omit<PhaseFromSupabase, 'completion_percentage'> & {
    id: string; // Ensure phase id is present
    completionPercentage: number | null;
    milestones: MilestoneForTimeline[];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authIsLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roadmap, setRoadmap] = useState<FullRoadmapFromSupabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetching Logic
  useEffect(() => {
        if (authIsLoading) return;
        if (!user) { navigate("/auth"); return; }
        const fetchData = async () => {
          setLoading(true); setError(null);
          try {
            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profileError && profileError.code !== 'PGRST116') throw profileError;
            if (!profileData) { navigate("/onboarding"); return; }
            setProfile(profileData);
            
            // Fetch Roadmap - ADD .limit(1) to handle potential duplicates
            const { data: roadmapData, error: roadmapError } = await supabase.from('roadmaps')
              .select(`*, phases(*, milestones(*, resources(*)))`)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false }) // Optionally order to get the latest
              .limit(1)
              .maybeSingle();

            console.log("Raw roadmap fetch result:", { roadmapData, roadmapError });

            // Error handling remains the same, maybeSingle now won't throw PGRST116 for multiple rows if limit(1) is used.
            if (roadmapError) throw roadmapError; // Throw other errors
            
            setRoadmap(roadmapData ? roadmapData as FullRoadmapFromSupabase : null);

          } catch (fetchError: any) { 
              console.error("Fetch Error:", fetchError);
              // Check if it's the expected 'no rows' error code for profile, handle gracefully
              if (fetchError?.code === 'PGRST116' && !profile) {
                  console.log("Profile not found, redirecting to onboarding.");
                  navigate("/onboarding");
                  return; // Prevent setting generic error
              }
              setError(fetchError.message || "Failed to load dashboard data."); 
              setProfile(null); setRoadmap(null); 
          }
          finally { setLoading(false); }
        };
        fetchData();
  }, [user, authIsLoading, navigate]);

  // Calculate Overall Progress
  useEffect(() => {
    if (roadmap?.phases) {
      const milestones = roadmap.phases.flatMap(p => p.milestones || []);
      const total = milestones.length; if (total === 0) { setOverallProgress(0); return; }
      const completed = milestones.filter(m => m.completed === true).length;
      setOverallProgress(Math.round((completed / total) * 100));
    } else { setOverallProgress(0); }
  }, [roadmap]);

  // Handle Milestone Toggle
  const handleMilestoneToggle = async (milestoneId: string, currentStatus: boolean) => {
      const newStatus = !currentStatus;
      const originalRoadmap = roadmap;
      let affectedPhaseId: string | null = null;
      let tempUpdatedRoadmap = roadmap ? { ...roadmap } : null;
      if (tempUpdatedRoadmap) {
          tempUpdatedRoadmap.phases = tempUpdatedRoadmap.phases.map(phase => {
              const milestoneIndex = phase.milestones.findIndex(m => m.id === milestoneId);
              if (milestoneIndex !== -1) {
                  affectedPhaseId = phase.id;
                  const updatedMilestones = [...phase.milestones];
                  updatedMilestones[milestoneIndex] = { ...updatedMilestones[milestoneIndex], completed: newStatus, updated_at: new Date().toISOString() };
                  return { ...phase, milestones: updatedMilestones };
              } return phase;
          });
      }
      if (tempUpdatedRoadmap && affectedPhaseId) {
          const phaseIndexToUpdate = tempUpdatedRoadmap.phases.findIndex(p => p.id === affectedPhaseId);
          if (phaseIndexToUpdate !== -1) {
              const phaseToUpdate = tempUpdatedRoadmap.phases[phaseIndexToUpdate];
              const totalM = phaseToUpdate.milestones.length;
              const completedM = phaseToUpdate.milestones.filter(m => m.completed === true).length;
              const newPhasePercentage = totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;
              tempUpdatedRoadmap.phases[phaseIndexToUpdate] = { ...phaseToUpdate, completion_percentage: newPhasePercentage };
          }
      }
      setRoadmap(tempUpdatedRoadmap);
      try {
          const { error: updateError } = await supabase.from('milestones').update({ completed: newStatus, updated_at: new Date().toISOString() }).eq('id', milestoneId);
          if (updateError) throw updateError;
          toast.success(newStatus ? "Milestone completed!" : "Milestone marked incomplete.");
      } catch (dbError: any) { console.error("Update Error:", dbError); toast.error(`Update failed: ${dbError.message}`); setRoadmap(originalRoadmap); }
  };

  // Helper Functions
  const getGoal = (d: Profile | null): string => d?.goals?.find(g => g.toLowerCase().startsWith("achieve goal:"))?.split(":").slice(1).join(":").trim() || d?.goals?.[0] || "-";
  const getFieldLabel = (d: Profile | null): string => d?.skills?.find(s => s.toLowerCase().startsWith("field:"))?.split(":").slice(1).join(":").trim() || d?.skills?.[0] || "-";
  const getTimelineLabel = (d: Profile | null): string => d?.goals?.find(g => g.toLowerCase().includes("within"))?.split("within").pop()?.trim() || "-";
  const getExperienceLabel = (d: Profile | null): string => d?.skills?.find(s => s.toLowerCase().startsWith("experience:"))?.split(":").slice(1).join(":").trim() || "-";
  const getBackgroundLabel = (d: Profile | null): string => d?.background?.replace(/_/g, ' ').replace(/ \w/g, l => l.toUpperCase()) || "N/A";

  // --- Loading / Error / No Profile States ---
  if (authIsLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-empowerPurple" /> <p className="ml-4 text-lg text-muted-foreground">Loading...</p></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4"><Navbar /><div className="text-center"><Info className="h-12 w-12 mx-auto text-destructive mb-4" /><h2 className="text-2xl font-bold mb-2 text-destructive-foreground">Error</h2><p className="text-muted-foreground mb-4">{error}</p><Button onClick={() => window.location.reload()}>Try Again</Button></div><Footer /></div>;
  if (!profile) return <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4"><Navbar /><div className="text-center"><Info className="h-12 w-12 mx-auto text-yellow-500 dark:text-yellow-400 mb-4" /><h2 className="text-2xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Profile Not Found</h2><p className="text-muted-foreground mb-4">Please complete onboarding.</p><Button onClick={() => navigate("/onboarding")}>Go to Onboarding</Button></div><Footer /></div>;

  // --- Prepare data for Components ---
  const phasesForTimeline: PhaseForTimeline[] | undefined = roadmap?.phases?.map(phase => ({
      ...phase, completionPercentage: phase.completion_percentage,
      milestones: phase.milestones?.map(milestone => ({ ...milestone, estimatedTime: milestone.estimated_time, completed: milestone.completed === true, resources: milestone.resources?.map(resource => ({ ...resource, imageUrl: resource.image_url })) || [] })) || [],
  }));
  const currentPhaseForFocus = roadmap?.phases?.find(phase => phase.milestones?.some(m => m.completed !== true));
  const currentMilestoneForFocus = currentPhaseForFocus?.milestones?.find(m => m.completed !== true);
  const currentResourcesForOverview: ResourceForTimeline[] = currentMilestoneForFocus?.resources?.slice(0, 2).map(r => ({ ...r, imageUrl: r.image_url })) ?? [];

  // --- Main Dashboard Content ---
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 py-8 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"><div><h1 className="text-3xl font-bold">Welcome, {profile.first_name || 'User'}</h1><p className="text-muted-foreground mt-1">Your learning journey</p></div><div className="mt-4 md:mt-0 flex items-center space-x-4"><Badge className="bg-empowerPurple capitalize">{getFieldLabel(profile)}</Badge><Badge variant="outline" className="border-empowerPurple text-empowerPurple capitalize"><Clock className="h-3 w-3 mr-1" />{getTimelineLabel(profile)} plan</Badge></div></div>
        {/* Goal Card */}
        <Card className="mb-8 shadow-md"><CardHeader className="pb-2"><CardTitle>Goal</CardTitle><CardDescription>Your target objective</CardDescription></CardHeader><CardContent><p className="text-lg font-medium">{getGoal(profile)}</p>{profile.challenges && (<p className="text-sm text-muted-foreground mt-2">Challenges: {profile.challenges}</p>)}</CardContent></Card>
        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><TabsList className="grid grid-cols-3 w-full sm:w-[400px] mb-4 sm:mb-0"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="roadmap">Roadmap</TabsTrigger><TabsTrigger value="resources">Resources</TabsTrigger></TabsList><div className="flex items-center w-full sm:w-auto justify-end"><p className="text-sm text-muted-foreground mr-2 whitespace-nowrap">Progress:</p><div className="w-full sm:w-48 flex items-center"><Progress value={overallProgress} className="h-2 mr-2 flex-grow" /><span className="text-sm font-medium">{overallProgress}%</span></div></div></div>

          {/* Overview Tab */}
           <TabsContent value="overview" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center"><GraduationCap className="h-5 w-5 mr-2 text-empowerPurple" />Focus</CardTitle></CardHeader><CardContent>{currentMilestoneForFocus ? (<div className="space-y-4"><h3 className="font-medium">{currentPhaseForFocus?.title}: {currentMilestoneForFocus.title}</h3><p className="text-muted-foreground">{currentMilestoneForFocus.description || "-"}</p><div className="flex items-center text-sm text-muted-foreground"><Clock className="h-4 w-4 mr-1" />Est: {currentMilestoneForFocus.estimated_time || "N/A"}</div></div>) : roadmap ? (<div className="text-center py-6"><CheckCheck className="h-10 w-10 mx-auto text-green-500 mb-2" /><p className="text-muted-foreground font-medium">Roadmap Complete!</p></div>) : (<div className="text-center py-6"><Info className="h-10 w-10 mx-auto text-muted-foreground mb-2" /><p className="text-muted-foreground">No roadmap available.</p></div>)}</CardContent><CardFooter>{roadmap && (<Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("roadmap")}><ArrowRight className="ml-2 h-4 w-4" />View Roadmap</Button>)}</CardFooter></Card>
                    <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center"><BookOpen className="h-5 w-5 mr-2 text-empowerPurple" />Resources</CardTitle><CardDescription>Current step</CardDescription></CardHeader><CardContent>{currentResourcesForOverview.length > 0 ? (<div className="space-y-2">{currentResourcesForOverview.map((r) => (<a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 hover:bg-muted rounded-md group"><div className="w-10 h-10 rounded mr-3 flex-shrink-0 bg-muted flex items-center justify-center">{r.imageUrl ? <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-muted-foreground"/>}</div><div className="flex-grow"><h4 className="font-medium text-sm group-hover:text-empowerPurple">{r.title}</h4><p className="text-xs text-muted-foreground">{r.type} • {r.platform}</p></div><ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-empowerPurple ml-2" /></a>))}</div>) : (<p className="text-sm text-muted-foreground text-center py-4">{currentMilestoneForFocus ? "No resources." : "-"}</p>)}</CardContent><CardFooter>{roadmap && (<Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("resources")}><ArrowRight className="ml-2 h-4 w-4" />View All</Button>)}</CardFooter></Card>
                    <Card className="shadow-sm md:col-span-2"><CardHeader><CardTitle className="flex items-center"><Award className="h-5 w-5 mr-2 text-empowerPurple" />Profile</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><div className="p-4 bg-muted rounded-lg"><h3 className="font-medium text-sm text-muted-foreground mb-1">Background</h3><p className="font-medium capitalize">{getBackgroundLabel(profile)}</p></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-medium text-sm text-muted-foreground mb-1">Experience</h3><p className="font-medium capitalize">{getExperienceLabel(profile)}</p></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-medium text-sm text-muted-foreground mb-1">Commitment</h3><p className="font-medium">{profile.time_available || "-"}</p></div></div></CardContent></Card>
                </div>
           </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="animate-fade-in">
            <Card className="shadow-sm">
              <CardHeader><CardTitle>Learning Roadmap</CardTitle><CardDescription>Your step-by-step guide</CardDescription></CardHeader>
              <CardContent>
                {roadmap && phasesForTimeline && phasesForTimeline.length > 0 ? (
                  <RoadmapTimeline
                    phases={phasesForTimeline}
                    onMilestoneToggle={handleMilestoneToggle}
                  />
                ) : (
                  <div className="text-center py-12"><Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-xl font-medium mb-2">No Roadmap Yet</h3><p className="text-muted-foreground">Please complete onboarding or check back later.</p></div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="animate-fade-in">
               <Card className="shadow-sm"><CardHeader><CardTitle>Learning Resources</CardTitle><CardDescription>Curated materials for your journey</CardDescription></CardHeader><CardContent>{roadmap && roadmap.phases && roadmap.phases.length > 0 ? ( roadmap.phases.map((phase, phaseIndex) => ( <div key={phase.id || phaseIndex} className="mb-8 last:mb-0"> <h3 className="font-semibold text-lg mb-3">{phase.title}</h3> {phase.milestones && phase.milestones.length > 0 ? ( phase.milestones.map((milestone, milestoneIndex) => ( <div key={milestone.id || milestoneIndex} className="mb-6 pl-4 border-l-2 border-border"> <h4 className="font-medium text-md mb-2">{milestone.title}</h4> {milestone.resources && milestone.resources.length > 0 ? ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {milestone.resources.map((resource) => ( <ResourceCard key={resource.id} resource={{...resource, imageUrl: resource.image_url }} /> ))} </div> ) : ( <p className="text-sm text-muted-foreground italic">No resources.</p> )} </div> )) ) : ( <p className="text-sm text-muted-foreground italic pl-4">No milestones.</p> )} {phaseIndex < roadmap.phases.length - 1 && <Separator className="my-6" />} </div> )) ) : ( <div className="text-center py-12"><Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-xl font-medium mb-2">No Resources</h3><p className="text-muted-foreground">Resources will appear with your roadmap.</p></div> )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
