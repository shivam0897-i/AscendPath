import React from "react"
import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, BookOpen, Award, ArrowRight, ArrowLeft } from "lucide-react"
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; // Import the Footer component
import { motion } from "framer-motion"; // Import motion

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

  // Animation variants for Fade + Slide Up/Down effect
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20 // Start slightly below and transparent
    },
    in: {
      opacity: 1,
      y: 0 // Fade in and slide to final position
    },
    out: {
      opacity: 0,
      y: -20 // Fade out and slide up slightly
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut", // Smooth easing
    duration: 0.4
  };

  return (
    // Wrap the top-level div with motion.div
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-white flex flex-col"
    >
      <Navbar />
      {/* Wrap content in a main tag with container styles */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* KEEP EXISTING CONTENT */} 
        <div className="flex flex-col items-center text-center mb-12">
          {/* Updated heading styles to match Privacy Policy (removed lg:text-6xl) */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#8c7bff]">Join Our</span>{" "}
            <span className="text-[#4a9fff]">
              Learning Community
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            Connect with fellow students, share your journey, and collaborate on educational roadmaps. Our community is
            built to support and empower each other through every step of the learning process.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              Join Community <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Browse Discussions
            </Button>
          </div>
        </div>

        <Tabs defaultValue="discussions" className="w-full mb-16">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discussions.map((discussion, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {discussion.category}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {discussion.replies}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{discussion.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{discussion.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{discussion.author.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{discussion.date}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Discussions</Button>
            </div>
          </TabsContent>

          <TabsContent value="study-groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2 bg-blue-50 text-blue-700 border-blue-200">
                      {group.topic}
                    </Badge>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {group.members} members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{group.description}</p>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Avatar key={i} className="border-2 border-white">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members > 4 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium">
                          +{group.members - 4}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Join Group</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Study Groups</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Start Your Own Study Group</h2>
              <p className="text-gray-600 mb-6">
                Have a specific learning goal? Create a study group and connect with students who share your interests.
                Lead discussions, share resources, and accelerate your learning journey together.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full mr-4 shadow-sm">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Build Your Network</h3>
                    <p className="text-sm text-gray-500">Connect with peers who share your educational goals</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full mr-4 shadow-sm">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Collaborative Learning</h3>
                    <p className="text-sm text-gray-500">Share resources and learn from different perspectives</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full mr-4 shadow-sm">
                    <Award className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Track Progress Together</h3>
                    <p className="text-sm text-gray-500">Stay motivated and celebrate achievements as a group</p>
                  </div>
                </div>
              </div>
              <Button className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                Create a Study Group
              </Button>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-50"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-50"></div>
              {/* Replace with actual image component or path */}
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Study group collaboration"
                width={400}
                height={400}
                className="relative z-10 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Back to Home Link (Optional within main or moved to footer) */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/" 
            className="inline-flex items-center justify-center rounded-full bg-purple-500 px-6 py-3 text-sm font-medium text-white hover:bg-purple-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </main>

      {/* Use the reusable Footer component */}
      <Footer /> 
    </motion.div>
  )
}
