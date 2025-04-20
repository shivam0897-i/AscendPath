import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Clock, BookOpen, Users, Star, MessageSquare, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroImage from "@/components/HeroImage";
import Chatbot from '@/components/Chatbot';

const Home = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const features = [
    {
      icon: <GraduationCap className="h-6 w-6 text-empowerPurple" />,
      title: "Personalized Learning Paths",
      description: "Get a customized educational roadmap based on your specific goals, skills, and circumstances."
    },
    {
      icon: <Clock className="h-6 w-6 text-empowerPurple" />,
      title: "Time-Optimized Planning",
      description: "Plans that respect your schedule and available time, making learning manageable alongside other commitments."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-empowerPurple" />,
      title: "Curated Resources",
      description: "Access to hand-picked learning materials, courses, and tools specifically selected for your journey."
    },
    {
      icon: <Users className="h-6 w-6 text-empowerPurple" />,
      title: "Community Support",
      description: "Connect with like-minded women and students on similar paths, share experiences and grow together."
    },
    {
      icon: <Star className="h-6 w-6 text-empowerPurple" />,
      title: "Goal Achievement Tracking",
      description: "Visualize your progress and celebrate milestones along your educational journey."
    }
  ];

  const testimonials = [
    {
      quote: "This platform helped me map out my journey from a complete beginner to securing a job in tech in just 8 months.",
      author: "Sarah J., Software Engineer",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
      quote: "As a mother returning to education after 10 years, I was overwhelmed until I found this roadmap tool.",
      author: "Maya R., Business Student",
      avatar: "https://i.pravatar.cc/150?img=25"
    },
    {
      quote: "The personalized approach made all the difference in my learning journey.",
      author: "Priya K., Data Scientist",
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  ];

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Chart Your Own <span className="gradient-text">Educational Journey</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A personalized learning platform designed to empower women and students with custom educational roadmaps tailored to your goals, skills, and schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-empowerPurple hover:bg-empowerPurple-dark">
                <Link to="/onboarding">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            {!isVideoPlaying ? (
               <HeroImage onClick={handlePlayVideo} />
              ) : (
              <div className="aspect-video w-full max-w-xl">
                   <iframe
                     className="w-full h-full rounded-lg shadow-lg"
                     src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                     title="YouTube video player"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen>
                   </iframe>
                 </div>
              )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Empower Your Education</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform offers a comprehensive set of tools to help you navigate your educational journey with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-empowerPurple-light rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our simple 3-step process creates your personalized educational roadmap
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-empowerPurple text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Share Your Goals</h3>
            <p className="text-gray-600">Tell us about your educational goals, current skills, and available time.</p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-empowerPurple text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">Get Your Roadmap</h3>
            <p className="text-gray-600">Receive a custom learning path with timeline, steps, and resources.</p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-empowerPurple text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
            <p className="text-gray-600">Follow your roadmap, track milestones, and adjust as needed.</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-empowerPurple hover:bg-empowerPurple-dark">
            <Link to="/onboarding">Create Your Roadmap</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from women and students who have transformed their educational journey with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <p className="font-medium">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-empowerPurple text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step toward your educational and career goals today.
          </p>
          <Button asChild size="lg" className="bg-white text-empowerPurple hover:bg-gray-100">
            <Link to="/onboarding">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <Footer />

      {/* Chat Popup Trigger Button */}
      {!isChatOpen && (
        <Button
          onClick={toggleChat}
          // Changed p-4 to p-5 to make the button slightly larger
          className="fixed bottom-6 right-6 z-50 rounded-full p-5 shadow-lg bg-empowerPurple hover:bg-empowerPurple-dark"
          aria-label="Open Chat"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      )}


      {/* Chat Popup Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <div className="relative shadow-xl rounded-lg">
            <Chatbot />
            <Button
              onClick={toggleChat}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
              aria-label="Close Chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
