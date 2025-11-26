import React from "react"
import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, BookOpen, Award, ArrowRight, ArrowLeft } from "lucide-react"
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function CommunityPage() {
  // Sample data for discussions (KEEP EXISTING DATA)
  const discussions = [
    {
      title: "How to structure your web development roadmap?",
      excerpt:
        "I'm new to coding and want to become a frontend developer. What skills should I prioritize and in what order?",
      category: "Web Development",
      replies: 24,
      author: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AC",
      },
      date: "2 days ago",
    },
    {
      title: "Data Science vs Machine Learning paths",
      excerpt:
        "I'm interested in both fields but not sure which roadmap to follow. What are the key differences in the learning paths?",
      category: "Data Science",
      replies: 18,
      author: {
        name: "Maya Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      date: "4 days ago",
    },
    {
      title: "Study techniques for self-paced learning",
      excerpt:
        "What study techniques have worked best for you when following a self-paced roadmap? I'm struggling with consistency.",
      category: "Study Tips",
      replies: 32,
      author: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JL",
      },
      date: "1 week ago",
    },
  ]

  // Sample data for study groups (KEEP EXISTING DATA)
  const studyGroups = [
    {
      name: "JavaScript Mastery",
      topic: "Web Development",
      members: 28,
      description:
        "A group focused on mastering JavaScript fundamentals and advanced concepts through collaborative projects.",
    },
    {
      name: "Data Science Explorers",
      topic: "Data Science",
      members: 42,
      description:
        "Weekly sessions on data analysis, visualization, and machine learning algorithms with real-world datasets.",
    },
    {
      name: "UI/UX Design Circle",
      topic: "Design",
      members: 19,
      description:
        "Share design work, get feedback, and discuss the latest trends in user interface and experience design.",
    },
  ]

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Wrap content in a main tag with container styles */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* KEEP EXISTING CONTENT */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Updated heading styles to match Privacy Policy (removed lg:text-6xl) */}
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="gradient-text">Join Our</span>{" "}
            <span className="text-charcoal dark:text-cream">
              Learning Community
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-4">
            Connect with fellow students, share your journey, and collaborate on educational roadmaps. Our community is
            built to support and empower each other through every step of the learning process.
          </p>
          <Badge variant="outline" className="mb-4 text-amber-600 border-amber-500 bg-amber-50/50">
            🚧 Coming Soon - Community features are under development
          </Badge>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-terracotta hover:bg-terracotta-dark shadow-warm"
            >
              Join Community <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-charcoal/20 hover:border-terracotta hover:text-terracotta">
              Browse Discussions
            </Button>
          </div>
        </div>

        <Tabs defaultValue="discussions" className="w-full mb-16">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8 bg-cream/50 dark:bg-charcoal/50">
            <TabsTrigger value="discussions" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">Discussions</TabsTrigger>
            <TabsTrigger value="study-groups" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">Study Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discussions.map((discussion, index) => (
                <Card key={index} className="hover:shadow-warm-md transition-all border-terracotta/10 hover:border-terracotta/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-sage-light/50 text-sage-dark">{discussion.category}</Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {discussion.replies}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-heading text-charcoal dark:text-cream">{discussion.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{discussion.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} alt={discussion.author.name} />
                        <AvatarFallback className="bg-terracotta-light text-terracotta">{discussion.author.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{discussion.author.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{discussion.date}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="border-terracotta/30 hover:border-terracotta hover:text-terracotta">View All Discussions</Button>
            </div>
          </TabsContent>

          <TabsContent value="study-groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group, index) => (
                <Card key={index} className="hover:shadow-warm-md transition-all border-sage/10 hover:border-sage/30">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2 bg-terracotta-light/50 text-terracotta-dark">{group.topic}</Badge>
                    <CardTitle className="font-heading text-charcoal dark:text-cream">{group.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-sage" />
                      {group.members} members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{group.description}</p>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback className="bg-gradient-to-br from-terracotta-light to-sage-light text-charcoal">U{i}</AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members > 4 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cream border-2 border-background text-xs font-medium text-charcoal">
                          +{group.members - 4}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-terracotta hover:bg-terracotta-dark">Join Group</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="border-terracotta/30 hover:border-terracotta hover:text-terracotta">View All Study Groups</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-warm-gradient rounded-2xl p-8 md:p-12 mb-16 border border-terracotta/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4 text-charcoal dark:text-cream">Start Your Own Study Group</h2>
              <p className="text-muted-foreground mb-6">
                Have a specific learning goal? Create a study group and connect with students who share your interests.
                Lead discussions, share resources, and accelerate your learning journey together.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-terracotta-light/50 p-2 rounded-full mr-4 shadow-warm">
                    <Users className="h-5 w-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal dark:text-cream">Build Your Network</h3>
                    <p className="text-sm text-muted-foreground">Connect with peers who share your educational goals</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-sage-light/50 p-2 rounded-full mr-4 shadow-warm">
                    <BookOpen className="h-5 w-5 text-sage-dark" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal dark:text-cream">Collaborative Learning</h3>
                    <p className="text-sm text-muted-foreground">Share resources and learn from different perspectives</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-100/50 p-2 rounded-full mr-4 shadow-warm">
                    <Award className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal dark:text-cream">Track Progress Together</h3>
                    <p className="text-sm text-muted-foreground">Stay motivated and celebrate achievements as a group</p>
                  </div>
                </div>
              </div>
              <Button className="mt-6 bg-terracotta hover:bg-terracotta-dark shadow-warm">
                Create a Study Group
              </Button>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-terracotta/20 rounded-full opacity-50"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-sage/20 rounded-full opacity-50"></div>
              {/* Replace with actual image component or path */}
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Study group collaboration"
                width={400}
                height={400}
                className="relative z-10 rounded-2xl shadow-warm-lg"
              />
            </div>
          </div>
        </div>

        {/* Back to Home Link (Optional within main or moved to footer) */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/" 
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-white hover:bg-terracotta-dark transition-colors shadow-warm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </main>

      {/* Use the reusable Footer component */}
      <Footer /> 
    </PageTransition>
  )
}
