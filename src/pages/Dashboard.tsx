import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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
  BookMarked,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import ResourceCard from "@/components/ResourceCard";
import SaveRoadmapButton from "@/components/SaveRoadmapButton";
import { useAuth } from "@/context/AuthContext";
import {
  useProfile,
  useRoadmap,
  useMilestoneToggle,
  calculateOverallProgress,
  transformPhasesForTimeline,
  profileHelpers,
  type ResourceForTimeline,
} from "@/hooks/useRoadmap";

const Dashboard = () => {
  const navigate = useNavigate();
  const { roadmapId } = useParams<{ roadmapId?: string }>();
  const { user, isLoading: authIsLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Use React Query hooks for data fetching
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: roadmap, isLoading: roadmapLoading, error: roadmapError } = useRoadmap(roadmapId);
  const milestoneToggle = useMilestoneToggle(roadmapId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authIsLoading && !user) {
      navigate("/auth");
    }
  }, [user, authIsLoading, navigate]);

  // Redirect to onboarding if no profile
  useEffect(() => {
    if (!profileLoading && !profile && user) {
      navigate("/onboarding");
    }
  }, [profile, profileLoading, user, navigate]);

  // Calculate progress from roadmap data
  const overallProgress = calculateOverallProgress(roadmap);

  // Handle Milestone Toggle
  const handleMilestoneToggle = async (milestoneId: string, currentStatus: boolean) => {
    milestoneToggle.mutate({ milestoneId, newStatus: !currentStatus });
  };

  // Use helper functions from hook
  const { getGoal, getFieldLabel, getTimelineLabel, getExperienceLabel, getBackgroundLabel } = profileHelpers;

  // Loading state
  const loading = authIsLoading || profileLoading || roadmapLoading;
  const error = profileError?.message || roadmapError?.message;

  // --- Loading / Error / No Profile States ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-terracotta" /> <p className="ml-4 text-lg text-muted-foreground font-heading">Loading your journey...</p></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4"><Navbar /><div className="text-center"><Info className="h-12 w-12 mx-auto text-destructive mb-4" /><h2 className="text-2xl font-heading font-bold mb-2 text-destructive-foreground">Error</h2><p className="text-muted-foreground mb-4">{error}</p><Button onClick={() => window.location.reload()} className="bg-terracotta hover:bg-terracotta-dark">Try Again</Button></div><Footer /></div>;
  if (!profile) return <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4"><Navbar /><div className="text-center"><Info className="h-12 w-12 mx-auto text-amber-500 dark:text-amber-400 mb-4" /><h2 className="text-2xl font-heading font-bold mb-2 text-amber-700 dark:text-amber-300">Profile Not Found</h2><p className="text-muted-foreground mb-4">Please complete onboarding.</p><Button onClick={() => navigate("/onboarding")} className="bg-terracotta hover:bg-terracotta-dark">Go to Onboarding</Button></div><Footer /></div>;

  // --- Prepare data for Components ---
  const phasesForTimeline = transformPhasesForTimeline(roadmap);
  const currentPhaseForFocus = roadmap?.phases?.find(phase => phase.milestones?.some(m => m.completed !== true));
  const currentMilestoneForFocus = currentPhaseForFocus?.milestones?.find(m => m.completed !== true);
  const currentResourcesForOverview: ResourceForTimeline[] = currentMilestoneForFocus?.resources?.slice(0, 2).map(r => ({ ...r, imageUrl: r.image_url })) ?? [];

  // Determine the goal to display - use roadmap title if viewing specific roadmap, otherwise profile goal
  const displayGoal = roadmapId && roadmap?.title 
    ? roadmap.title.replace(/roadmap/i, '').replace(/for \w+/i, '').trim() || roadmap.title
    : getGoal(profile);

  // --- Main Dashboard Content ---
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 py-8 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-cream">Welcome, {profile.first_name || 'User'}</h1>
            <p className="text-muted-foreground mt-1">Your learning journey awaits</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-terracotta text-white capitalize">{getFieldLabel(profile)}</Badge>
            <Badge variant="outline" className="border-sage text-sage-dark capitalize"><Clock className="h-3 w-3 mr-1" />{getTimelineLabel(profile)} plan</Badge>
            <Link to="/dashboard/saved-roadmaps">
              <Button variant="outline" size="sm" className="border-terracotta/30 hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta">
                <BookMarked className="h-4 w-4 mr-2" />
                My Roadmaps
              </Button>
            </Link>
          </div>
        </div>
        {/* Goal Card */}
        <Card className="mb-8 shadow-warm border-terracotta/20">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="font-heading text-charcoal dark:text-cream">
                  {roadmapId ? "Current Roadmap" : "Your Goal"}
                </CardTitle>
                <CardDescription>
                  {roadmapId ? roadmap?.title : "Your target objective"}
                </CardDescription>
              </div>
              {roadmap && (
                <SaveRoadmapButton 
                  size="sm"
                  roadmap={{
                    id: roadmap.id,
                    title: roadmap.title,
                    description: roadmap.description,
                    goalRole: displayGoal,
                    progress: overallProgress,
                    milestoneCount: roadmap.phases?.flatMap(p => p.milestones || []).length || 0,
                    completedMilestones: roadmap.phases?.flatMap(p => p.milestones || []).filter(m => m.completed).length || 0,
                    phaseCount: roadmap.phases?.length || 0,
                    status: overallProgress === 100 ? "completed" : overallProgress === 0 ? "draft" : "in-progress",
                  }}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-charcoal dark:text-cream">{displayGoal}</p>
            {!roadmapId && profile.challenges && (
              <p className="text-sm text-muted-foreground mt-2">Challenges: {profile.challenges}</p>
            )}
            {roadmap?.description && (
              <p className="text-sm text-muted-foreground mt-2">{roadmap.description}</p>
            )}
          </CardContent>
        </Card>
        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><TabsList className="grid grid-cols-3 w-full sm:w-[400px] mb-4 sm:mb-0 bg-cream/50 dark:bg-charcoal/50"><TabsTrigger value="overview" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">Overview</TabsTrigger><TabsTrigger value="roadmap" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">Roadmap</TabsTrigger><TabsTrigger value="resources" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">Resources</TabsTrigger></TabsList><div className="flex items-center w-full sm:w-auto justify-end"><p className="text-sm text-muted-foreground mr-2 whitespace-nowrap">Progress:</p><div className="w-full sm:w-48 flex items-center"><Progress value={overallProgress} className="h-2 mr-2 flex-grow [&>div]:bg-gradient-to-r [&>div]:from-terracotta [&>div]:to-sage" /><span className="text-sm font-semibold text-terracotta">{overallProgress}%</span></div></div></div>

          {/* Overview Tab */}
           <TabsContent value="overview" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-warm border-terracotta/10 hover:shadow-warm-md transition-shadow"><CardHeader><CardTitle className="flex items-center font-heading"><GraduationCap className="h-5 w-5 mr-2 text-terracotta" />Current Focus</CardTitle></CardHeader><CardContent>{currentMilestoneForFocus ? (<div className="space-y-4"><h3 className="font-medium text-charcoal dark:text-cream">{currentPhaseForFocus?.title}: {currentMilestoneForFocus.title}</h3><p className="text-muted-foreground">{currentMilestoneForFocus.description || "-"}</p><div className="flex items-center text-sm text-muted-foreground"><Clock className="h-4 w-4 mr-1 text-sage" />Est: {currentMilestoneForFocus.estimated_time || "N/A"}</div></div>) : roadmap ? (<div className="text-center py-6"><CheckCheck className="h-10 w-10 mx-auto text-sage mb-2" /><p className="text-muted-foreground font-medium">Roadmap Complete!</p></div>) : (<div className="text-center py-6"><Info className="h-10 w-10 mx-auto text-muted-foreground mb-2" /><p className="text-muted-foreground">No roadmap available.</p></div>)}</CardContent><CardFooter>{roadmap && (<Button variant="outline" size="sm" className="w-full border-terracotta/30 hover:border-terracotta hover:text-terracotta" onClick={() => setActiveTab("roadmap")}><ArrowRight className="ml-2 h-4 w-4" />View Roadmap</Button>)}</CardFooter></Card>
                    <Card className="shadow-warm border-sage/10 hover:shadow-warm-md transition-shadow"><CardHeader><CardTitle className="flex items-center font-heading"><BookOpen className="h-5 w-5 mr-2 text-sage-dark" />Resources</CardTitle><CardDescription>Current step</CardDescription></CardHeader><CardContent>{currentResourcesForOverview.length > 0 ? (<div className="space-y-2">{currentResourcesForOverview.map((r) => (<a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 hover:bg-cream/50 dark:hover:bg-charcoal/50 rounded-md group"><div className="w-10 h-10 rounded mr-3 flex-shrink-0 bg-cream dark:bg-charcoal/50 flex items-center justify-center">{r.imageUrl ? <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover rounded" /> : <BookOpen className="w-5 h-5 text-sage"/>}</div><div className="flex-grow"><h4 className="font-medium text-sm group-hover:text-terracotta transition-colors">{r.title}</h4><p className="text-xs text-muted-foreground">{r.type} • {r.platform}</p></div><ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-terracotta ml-2 transition-colors" /></a>))}</div>) : (<p className="text-sm text-muted-foreground text-center py-4">{currentMilestoneForFocus ? "No resources." : "-"}</p>)}</CardContent><CardFooter>{roadmap && (<Button variant="outline" size="sm" className="w-full border-sage/30 hover:border-sage hover:text-sage-dark" onClick={() => setActiveTab("resources")}><ArrowRight className="ml-2 h-4 w-4" />View All</Button>)}</CardFooter></Card>
                    <Card className="shadow-warm md:col-span-2 border-amber-200/30"><CardHeader><CardTitle className="flex items-center font-heading"><Award className="h-5 w-5 mr-2 text-amber-500" />Your Profile</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><div className="p-4 bg-gradient-to-br from-terracotta-light/30 to-cream rounded-xl"><h3 className="font-medium text-sm text-muted-foreground mb-1">Background</h3><p className="font-medium capitalize text-charcoal dark:text-cream">{getBackgroundLabel(profile)}</p></div><div className="p-4 bg-gradient-to-br from-sage-light/30 to-cream rounded-xl"><h3 className="font-medium text-sm text-muted-foreground mb-1">Experience</h3><p className="font-medium capitalize text-charcoal dark:text-cream">{getExperienceLabel(profile)}</p></div><div className="p-4 bg-gradient-to-br from-amber-100/50 to-cream rounded-xl"><h3 className="font-medium text-sm text-muted-foreground mb-1">Commitment</h3><p className="font-medium text-charcoal dark:text-cream">{profile.time_available || "-"}</p></div></div></CardContent></Card>
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
