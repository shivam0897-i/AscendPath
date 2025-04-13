
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Award,
  ArrowRight,
  CheckCheck,
  Info,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import ResourceCard from "@/components/ResourceCard";

// Type definition for user data
type UserData = {
  name: string;
  email: string;
  goal: string;
  field: string;
  background: string;
  experience: string;
  timeCommitment: number;
  challenges?: string;
  timeline: string;
};

// Placeholder roadmap data
const PLACEHOLDER_ROADMAP = {
  tech: [
    {
      title: "Foundation Phase",
      description: "Building core knowledge and skills",
      completionPercentage: 0,
      milestones: [
        {
          title: "Learn programming fundamentals",
          description: "Master basic programming concepts and syntax",
          resources: [
            {
              title: "Introduction to Computer Science",
              type: "Course",
              platform: "edX",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=32"
            },
            {
              title: "Programming Fundamentals",
              type: "Tutorial",
              platform: "Codecademy",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=58"
            }
          ],
          estimatedTime: "4 weeks",
          completed: false
        },
        {
          title: "Build your first web application",
          description: "Apply your knowledge by creating a simple web app",
          resources: [
            {
              title: "Web Development Bootcamp",
              type: "Course",
              platform: "Udemy",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=48"
            }
          ],
          estimatedTime: "3 weeks",
          completed: false
        }
      ]
    },
    {
      title: "Specialization Phase",
      description: "Focusing on your area of interest",
      completionPercentage: 0,
      milestones: [
        {
          title: "Choose and learn a framework",
          description: "Select a popular framework and build projects with it",
          resources: [
            {
              title: "React - The Complete Guide",
              type: "Course",
              platform: "Coursera",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=68"
            }
          ],
          estimatedTime: "6 weeks",
          completed: false
        },
        {
          title: "Build a portfolio project",
          description: "Create a comprehensive project showcasing your skills",
          resources: [
            {
              title: "Building a Professional Portfolio",
              type: "Workshop",
              platform: "LinkedIn Learning",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=8"
            }
          ],
          estimatedTime: "4 weeks",
          completed: false
        }
      ]
    },
    {
      title: "Career Preparation Phase",
      description: "Getting ready for the job market",
      completionPercentage: 0,
      milestones: [
        {
          title: "Prepare for technical interviews",
          description: "Practice common interview questions and coding challenges",
          resources: [
            {
              title: "Tech Interview Handbook",
              type: "Book",
              platform: "GitHub",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=20"
            },
            {
              title: "Coding Interview Prep",
              type: "Practice",
              platform: "LeetCode",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=33"
            }
          ],
          estimatedTime: "4 weeks",
          completed: false
        },
        {
          title: "Network and apply for positions",
          description: "Reach out to industry professionals and submit applications",
          resources: [
            {
              title: "Networking for Tech Professionals",
              type: "Webinar",
              platform: "Women Who Code",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=25"
            }
          ],
          estimatedTime: "Ongoing",
          completed: false
        }
      ]
    }
  ],
  business: [
    {
      title: "Foundation Phase",
      description: "Building core business knowledge",
      completionPercentage: 0,
      milestones: [
        {
          title: "Learn business fundamentals",
          description: "Master key business concepts and principles",
          resources: [
            {
              title: "Introduction to Business",
              type: "Course",
              platform: "Coursera",
              url: "#",
              imageUrl: "https://i.pravatar.cc/300?img=18"
            }
          ],
          estimatedTime: "4 weeks",
          completed: false
        }
      ]
    }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData) as UserData;
      setUserData(parsedUserData);
      
      // Set roadmap data based on user's field
      // In a real app, this would come from an API
      if (parsedUserData.field === "tech") {
        setRoadmap(PLACEHOLDER_ROADMAP.tech);
      } else {
        // Default to business roadmap for now
        setRoadmap(PLACEHOLDER_ROADMAP.business);
      }
    } else {
      // If no user data, redirect to onboarding
      navigate("/onboarding");
    }
  }, [navigate]);
  
  const timelineLabel = (timeline: string) => {
    const map: Record<string, string> = {
      "3_months": "3 months",
      "6_months": "6 months",
      "1_year": "1 year",
      "2_years": "2 years",
      "3_plus_years": "3+ years",
    };
    return map[timeline] || timeline;
  };
  
  const fieldLabel = (field: string) => {
    const map: Record<string, string> = {
      "tech": "Technology",
      "business": "Business",
      "healthcare": "Healthcare",
      "education": "Education",
      "arts": "Arts & Design",
      "science": "Science",
      "other": "Other",
    };
    return map[field] || field;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8">
        {userData ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Welcome, {userData.name}</h1>
                <p className="text-gray-600 mt-1">Here's your personalized learning journey</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                <Badge className="mr-4 bg-empowerPurple">
                  {fieldLabel(userData.field)}
                </Badge>
                <Badge variant="outline" className="border-empowerPurple text-empowerPurple">
                  <Clock className="h-3 w-3 mr-1" />
                  {timelineLabel(userData.timeline)} plan
                </Badge>
              </div>
            </div>
            
            <Card className="mb-8 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle>Your Goal</CardTitle>
                <CardDescription>What you're working towards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{userData.goal}</p>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList className="grid grid-cols-3 w-[400px]">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                
                <div className="hidden md:flex items-center">
                  <p className="text-sm text-gray-600 mr-2">Overall Progress:</p>
                  <div className="w-48 flex items-center">
                    <Progress value={overallProgress} className="h-2 mr-2" />
                    <span className="text-sm font-medium">{overallProgress}%</span>
                  </div>
                </div>
              </div>
              
              <TabsContent value="overview" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-empowerPurple" />
                        Current Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {roadmap.length > 0 && roadmap[0].milestones && (
                        <div className="space-y-4">
                          <h3 className="font-medium">{roadmap[0].title}: {roadmap[0].milestones[0].title}</h3>
                          <p className="text-gray-600">{roadmap[0].milestones[0].description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" /> 
                            Estimated time: {roadmap[0].milestones[0].estimatedTime}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("roadmap")}>
                        View Full Roadmap
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-empowerPurple" />
                        Recommended Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {roadmap.length > 0 && roadmap[0].milestones && roadmap[0].milestones[0].resources && (
                        <div className="space-y-2">
                          {roadmap[0].milestones[0].resources.slice(0, 2).map((resource: any, i: number) => (
                            <div key={i} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                              <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                                <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">{resource.title}</h4>
                                <p className="text-xs text-gray-500">{resource.type} • {resource.platform}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("resources")}>
                        View All Resources
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="shadow-sm md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-empowerPurple" />
                        Your Learning Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-sm text-gray-500 mb-1">Educational Background</h3>
                          <p className="font-medium">{userData.background.replace('_', ' ')}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-sm text-gray-500 mb-1">Experience Level</h3>
                          <p className="font-medium">{userData.experience}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-sm text-gray-500 mb-1">Weekly Commitment</h3>
                          <p className="font-medium">{userData.timeCommitment} hours per week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="roadmap" className="animate-fade-in">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Your Learning Roadmap</CardTitle>
                    <CardDescription>A step-by-step guide to achieve your goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {roadmap.length > 0 ? (
                      <RoadmapTimeline phases={roadmap} />
                    ) : (
                      <div className="text-center py-12">
                        <Info className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Roadmap Coming Soon</h3>
                        <p className="text-gray-600">We're preparing your personalized roadmap. Check back later!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resources" className="animate-fade-in">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Learning Resources</CardTitle>
                    <CardDescription>Curated materials to help you on your journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-lg mb-3">Current Phase Resources</h3>
                      {roadmap.length > 0 && roadmap[0].milestones ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {roadmap[0].milestones.flatMap((milestone: any) => 
                            milestone.resources.map((resource: any, i: number) => (
                              <ResourceCard key={`${milestone.title}-${i}`} resource={resource} />
                            ))
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">No resources available yet.</p>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-3">Additional Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ResourceCard 
                          resource={{
                            title: "Women in Tech Mentorship Program",
                            type: "Mentorship",
                            platform: "Global",
                            url: "#",
                            imageUrl: "https://i.pravatar.cc/300?img=25"
                          }} 
                        />
                        <ResourceCard 
                          resource={{
                            title: "Networking for Career Growth",
                            type: "E-book",
                            platform: "Career Guide",
                            url: "#",
                            imageUrl: "https://i.pravatar.cc/300?img=23"
                          }} 
                        />
                        <ResourceCard 
                          resource={{
                            title: "Financial Aid for Women in Education",
                            type: "Guide",
                            platform: "Educational Resources",
                            url: "#",
                            imageUrl: "https://i.pravatar.cc/300?img=44"
                          }} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Loading your profile...</h2>
              <Progress value={50} className="w-64 mx-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
