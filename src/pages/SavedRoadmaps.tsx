import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mountain, 
  Compass, 
  Sparkles, 
  ArrowRight,
  BookMarked,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoadmapCard from "@/components/RoadmapCard";
import { useSavedRoadmaps } from "@/hooks/useSavedRoadmaps";
import { useAuth } from "@/context/AuthContext";

const SavedRoadmapsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: savedRoadmaps, isLoading, error } = useSavedRoadmaps();

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4 p-6 rounded-xl border bg-card">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Decorative illustration */}
      <div className="relative mb-8">
        <motion.div
          animate={{ 
            y: [0, -8, 0],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative z-10"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-terracotta/20 via-cream to-sage/20 flex items-center justify-center">
            <BookMarked className="w-16 h-16 text-terracotta/60" />
          </div>
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            x: [0, 4, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5 
          }}
          className="absolute -top-2 -right-4"
        >
          <Sparkles className="w-8 h-8 text-amber-400" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1 
          }}
          className="absolute -bottom-2 -left-4"
        >
          <Compass className="w-6 h-6 text-sage" />
        </motion.div>
      </div>

      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-charcoal dark:text-cream text-center mb-3">
        No saved roadmaps yet
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8 text-lg">
        Start your career journey! Generate a personalized roadmap and save it here to track your progress.
      </p>

      {/* CTA Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="lg"
          onClick={() => navigate("/onboarding")}
          className="bg-gradient-to-r from-terracotta to-terracotta-dark text-white shadow-warm hover:shadow-warm-lg text-lg px-8 py-6 h-auto"
        >
          <Mountain className="mr-2 h-5 w-5" />
          Generate My Roadmap
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>

      {/* Secondary option */}
      <p className="text-sm text-muted-foreground mt-6">
        Already have a roadmap?{" "}
        <button 
          onClick={() => navigate("/dashboard")} 
          className="text-terracotta hover:underline font-medium"
        >
          View your dashboard
        </button>
      </p>
    </motion.div>
  );

  // Error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-xl font-heading font-bold text-charcoal dark:text-cream mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        We couldn't load your saved roadmaps. Please try again.
      </p>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()}
        className="border-terracotta/30 hover:border-terracotta hover:text-terracotta"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-terracotta/5 via-background to-background">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-pattern-topo opacity-30" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
          
          <div className="container px-4 py-12 md:py-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-terracotta/10 rounded-lg">
                  <BookMarked className="h-6 w-6 text-terracotta" />
                </div>
                <span className="text-sm font-medium text-terracotta uppercase tracking-wide">
                  Your Career Journey Hub
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-charcoal dark:text-cream mb-4">
                Saved Roadmaps
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl">
                Your personalized career paths, saved and ready to continue. 
                Track your progress and keep climbing toward your goals.
              </p>

              {/* Stats row */}
              {savedRoadmaps && savedRoadmaps.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border/50"
                >
                  <div>
                    <p className="text-2xl font-bold text-terracotta">{savedRoadmaps.length}</p>
                    <p className="text-sm text-muted-foreground">Saved Roadmaps</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-sage-dark">
                      {savedRoadmaps.filter(r => r.status === "in-progress").length}
                    </p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">
                      {savedRoadmaps.filter(r => r.status === "completed").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Roadmaps Grid Section */}
        <section className="container px-4 py-8 md:py-12">
          {isLoading || authLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : !savedRoadmaps || savedRoadmaps.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {savedRoadmaps.map((roadmap, index) => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} index={index} />
              ))}
            </motion.div>
          )}

          {/* Add New Roadmap CTA (when there are existing roadmaps) */}
          {savedRoadmaps && savedRoadmaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground mb-4">
                Ready to explore a new career path?
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="border-terracotta/30 hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Another Roadmap
              </Button>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SavedRoadmapsPage;
