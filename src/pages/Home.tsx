import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Clock, BookOpen, Users, Star, MessageSquare, X, Briefcase, Code, TrendingUp, Target, Compass, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from '@/components/Chatbot';
import PageTransition from "@/components/PageTransition";

// Custom hook for scroll-triggered animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Career Roadmap Visual Component - The heart of the hero
const CareerRoadmapVisual = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered animation for journey progression
    const timers = [
      setTimeout(() => setAnimationPhase(1), 400),
      setTimeout(() => setAnimationPhase(2), 800),
      setTimeout(() => setAnimationPhase(3), 1300),
      setTimeout(() => setAnimationPhase(4), 1800),
      setTimeout(() => setAnimationPhase(5), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const milestones = [
    { icon: Compass, label: "You Are Here", sublabel: "Starting Point", color: "bg-sage/20", iconColor: "text-sage-dark", delay: 1 },
    { icon: BookOpen, label: "Learn Skills", sublabel: "Build Foundation", color: "bg-terracotta/10", iconColor: "text-terracotta", delay: 2 },
    { icon: Code, label: "Build Projects", sublabel: "Gain Experience", color: "bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400", delay: 3 },
    { icon: Briefcase, label: "Dream Career", sublabel: "Your Goal", color: "bg-terracotta", iconColor: "text-white", isGoal: true, delay: 4 },
  ];

  // Positions mapped precisely to the SVG path curve points
  // Adjusted to prevent middle card overlap and align with path spine
  const positions = [
    { left: '3%', bottom: '3%', rotate: 0, scale: 1 },
    { left: '18%', bottom: '28%', rotate: 0, scale: 0.95 },
    { left: '42%', bottom: '50%', rotate: 0, scale: 0.95 },
    { left: '70%', bottom: '74%', rotate: 0, scale: 1 },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-[320px] sm:h-[380px] lg:h-[440px] select-none overflow-visible">
      {/* SVG Path - Smooth flowing ascent curve */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 400 460" 
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Main path gradient */}
          <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B8F71" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#C96B4B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C96B4B" stopOpacity="0.7" />
          </linearGradient>
          
          {/* Animated progress gradient */}
          <linearGradient id="progressGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B8F71" />
            <stop offset="50%" stopColor="#C96B4B" />
            <stop offset="100%" stopColor="#C96B4B" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Decorative topographic lines - subtle terrain feel */}
        <g className={`transition-opacity duration-1000 ${animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <path
            d="M 10 440 C 80 420, 160 390, 240 350 C 320 310, 380 260, 400 220"
            stroke="#6B8F71"
            strokeWidth="1"
            strokeOpacity="0.08"
            fill="none"
          />
          <path
            d="M 0 400 C 100 380, 180 340, 260 290 C 340 240, 390 180, 420 140"
            stroke="#6B8F71"
            strokeWidth="1"
            strokeOpacity="0.06"
            fill="none"
          />
          <path
            d="M 20 360 C 100 340, 200 280, 280 220 C 360 160, 400 100, 420 60"
            stroke="#C96B4B"
            strokeWidth="1"
            strokeOpacity="0.05"
            fill="none"
          />
        </g>

        {/* Main dashed path (background track) - smooth continuous arc */}
        <path
          d="M 30 420 
             C 50 400, 70 370, 100 330
             C 140 280, 180 230, 230 185
             C 280 140, 330 95, 380 55"
          stroke="url(#pathGradient)"
          strokeWidth="3"
          strokeDasharray="10 6"
          strokeLinecap="round"
          fill="none"
          className={`transition-all duration-1000 ease-out ${animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Animated progress path (smooth flowing line) */}
        <path
          d="M 30 420 
             C 50 400, 70 370, 100 330
             C 140 280, 180 230, 230 185
             C 280 140, 330 95, 380 55"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          filter="url(#pathGlow)"
          style={{
            strokeDasharray: '550',
            strokeDashoffset: animationPhase >= 2 ? '0' : '550',
            transition: 'stroke-dashoffset 2.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
            opacity: animationPhase >= 1 ? 1 : 0
          }}
        />

        {/* Path anchor dots - aligned precisely on the curve */}
        {[
          { cx: 30, cy: 420 },
          { cx: 100, cy: 330 },
          { cx: 230, cy: 185 },
          { cx: 380, cy: 55 }
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="5"
            fill={i === 3 ? "#C96B4B" : "#6B8F71"}
            stroke="white"
            strokeWidth="2"
            className={`transition-all duration-500 ${animationPhase >= i + 1 ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${i * 200}ms` }}
          />
        ))}

        {/* Direction arrow at the end */}
        <path
          d="M 375 60 L 390 45 L 380 50 Z"
          fill="#C96B4B"
          className={`transition-all duration-500 ${animationPhase >= 5 ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '300ms' }}
        />
      </svg>

      {/* Milestone markers - positioned along the curve */}
      {milestones.map((milestone, index) => {
        const pos = positions[index];
        const isVisible = animationPhase >= milestone.delay;
        const Icon = milestone.icon;
        const cardScale = pos.scale;

        return (
          <div
            key={index}
            className={`absolute transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ 
              left: pos.left, 
              bottom: pos.bottom,
              zIndex: 10 + index,
              transitionDelay: isVisible ? `${(milestone.delay - 1) * 180}ms` : '0ms'
            }}
          >
            <div 
              className={`relative group cursor-default ${milestone.isGoal ? 'z-20' : ''}`}
              style={{ transform: `scale(${cardScale})` }}
            >
              {/* Glow effect for goal */}
              {milestone.isGoal && (
                <div className="absolute -inset-3 bg-terracotta/25 rounded-3xl blur-2xl animate-pulse-soft" />
              )}
              
              {/* Milestone card */}
              <div 
                className={`
                  relative flex flex-col items-center 
                  p-2 sm:p-2.5 lg:p-3 
                  rounded-lg sm:rounded-xl
                  backdrop-blur-sm
                  group-hover:scale-105 group-hover:-translate-y-1 
                  transition-all duration-300 ease-out
                  ${milestone.isGoal 
                    ? 'bg-gradient-to-br from-terracotta to-terracotta-dark text-white shadow-warm-xl ring-2 ring-white/20 p-2.5 sm:p-3 lg:p-4' 
                    : 'bg-card/95 dark:bg-charcoal-light/90 border border-border/60 dark:border-cream/15 shadow-warm-md hover:shadow-warm-lg'
                  }
                `}
              >
                {/* Icon container */}
                <div className={`
                  w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 
                  rounded-lg 
                  flex items-center justify-center mb-1 sm:mb-1.5
                  transition-transform duration-300 group-hover:scale-110
                  ${milestone.isGoal 
                    ? 'bg-white/20' 
                    : milestone.color
                  }
                `}>
                  <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 ${milestone.iconColor}`} />
                </div>
                
                {/* Label */}
                <span className={`
                  text-[9px] sm:text-[10px] lg:text-xs font-semibold text-center whitespace-nowrap leading-tight
                  ${milestone.isGoal ? 'text-white' : 'text-charcoal dark:text-cream'}
                `}>
                  {milestone.label}
                </span>

                {/* Checkmark for starting point */}
                {index === 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sage rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-charcoal">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Goal badge */}
                {milestone.isGoal && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-amber-400 text-charcoal text-[9px] sm:text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
                    Goal
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Decorative elements */}
      <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-terracotta/8 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-16 left-0 w-20 h-20 bg-gradient-to-tr from-sage/10 to-transparent rounded-full blur-xl pointer-events-none" />
    </div>
  );
};

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Animation refs for each section
  const featuresAnimation = useScrollAnimation();
  const howItWorksAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  // Features data with warm brand colors
  const features = [
    {
      icon: <GraduationCap className="h-6 w-6 text-terracotta" />,
      title: "Personalized Learning Paths",
      description: "Get a customized educational roadmap based on your specific goals, skills, and circumstances."
    },
    {
      icon: <Clock className="h-6 w-6 text-sage-dark" />,
      title: "Time-Optimized Planning",
      description: "Plans that respect your schedule and available time, making learning manageable alongside other commitments."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-terracotta" />,
      title: "Curated Resources",
      description: "Access to hand-picked learning materials, courses, and tools specifically selected for your journey."
    },
    {
      icon: <Users className="h-6 w-6 text-sage-dark" />,
      title: "Community Support",
      description: "Connect with like-minded working professionals and students on similar paths, share experiences and grow together."
    },
    {
      icon: <Star className="h-6 w-6 text-amber-500" />,
      title: "Goal Achievement Tracking",
      description: "Visualize your progress and celebrate milestones along your educational journey."
    }
  ];

  // KEEP EXISTING TESTIMONIALS DATA
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

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <PageTransition className="min-h-screen flex flex-col">
      <Navbar />

      {/* Ensure main content takes remaining space */}
      <main className="flex-grow"> 
        {/* Hero Section - "Roadmap to Your Future Career" */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
          {/* Layered background */}
          <div className="absolute inset-0 bg-hero-light dark:bg-hero-dark" />
          <div className="absolute inset-0 bg-pattern-topo opacity-30 dark:opacity-15 pointer-events-none" />
          
          {/* Warm ambient glows */}
          <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-terracotta/20 dark:from-terracotta/10 to-transparent rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-gradient-to-tr from-sage/15 dark:from-sage/8 to-transparent rounded-full blur-[60px] pointer-events-none" />
          
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16">
            {/* Grid: 58% text / 42% visual on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
              
              {/* Left: Text Content - Upper-left power zone */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="max-w-[540px]">
                  {/* Trust badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 dark:bg-sage/20 rounded-full mb-8 lg:mb-10 animate-fade-in-up">
                    <Target className="w-4 h-4 text-sage-dark dark:text-sage" />
                    <span className="text-sm font-medium text-sage-dark dark:text-sage">
                      Trusted by 10,000+ students & professionals
                    </span>
                  </div>
                  
                  {/* Headline - Primary focal point */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-heading font-bold mb-5 lg:mb-6 leading-[1.15] text-charcoal dark:text-cream animate-fade-in-up animate-stagger-1">
                    Your Career Begins With the{" "}
                    <span className="relative">
                      <span className="gradient-text">Right Roadmap</span>
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-terracotta/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                        <path d="M0 6 Q50 0 100 6 T200 6" stroke="currentColor" strokeWidth="3" fill="none" />
                      </svg>
                    </span>
                  </h1>
                  
                  {/* Subhead - Supporting narrative */}
                  <p className="text-base lg:text-lg xl:text-xl text-muted-foreground dark:text-cream/70 mb-8 lg:mb-10 leading-relaxed animate-fade-in-up animate-stagger-2">
                    A personalized learning journey designed to help students and professionals reach their dream career with{" "}
                    <span className="text-charcoal dark:text-cream font-medium">clarity</span>,{" "}
                    <span className="text-charcoal dark:text-cream font-medium">confidence</span>, and{" "}
                    <span className="text-charcoal dark:text-cream font-medium">momentum</span>.
                  </p>
                  
                  {/* CTAs - Clear actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animate-stagger-3">
                    <Button asChild size="xl" variant="warm" className="group">
                      <Link to="/onboarding">
                        Generate My Roadmap
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-charcoal/20 dark:border-cream/20 hover:border-sage dark:hover:border-sage hover:text-sage-dark dark:hover:text-sage hover:bg-sage/5 dark:text-cream transition-all h-14 px-8 text-base"
                    >
                      <Link to="/Questionnaire">
                        <Compass className="mr-2 h-5 w-5" />
                        Explore Careers
                      </Link>
                    </Button>
                  </div>

                  {/* Testimonial preview - Social proof under CTA */}
                  <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-cream/50 dark:bg-charcoal-light/30 rounded-lg lg:rounded-xl border border-sage/20 dark:border-cream/10 animate-fade-in-up animate-stagger-4">
                    <div className="flex items-start gap-2.5 lg:gap-3">
                      <img
                        src="https://i.pravatar.cc/150?img=32"
                        alt="Michael R."
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white dark:border-charcoal shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm text-charcoal dark:text-cream/90 italic leading-relaxed">
                          "Within 6 months of following my AscendPath roadmap, I transitioned from retail into software engineering."
                        </p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground dark:text-cream/50 mt-1.5 font-medium">
                          — Michael R., Software Engineer at Spotify
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social proof mini */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border/50 dark:border-cream/10 animate-fade-in-up animate-stagger-5">
                    <div className="flex -space-x-3">
                      {[32, 25, 5, 12].map((img, i) => (
                        <img
                          key={i}
                          src={`https://i.pravatar.cc/150?img=${img}`}
                          alt="User"
                          className="w-10 h-10 rounded-full border-2 border-cream dark:border-charcoal"
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-muted-foreground dark:text-cream/60">
                        4.9/5 from 2,000+ reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Career Roadmap Visual */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end -mx-2 sm:mx-0">
                <div className="w-full max-w-[360px] sm:max-w-[400px] lg:max-w-none animate-fade-in animate-stagger-2">
                  <CareerRoadmapVisual />
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Feature Section - Cards with personality */}
        <section 
          ref={featuresAnimation.ref}
          className="py-24 bg-section-warm px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-pattern-grid opacity-30 dark:opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-noise" />
          
          <div className="max-w-7xl mx-auto relative">
            <div className={`text-center mb-16 transition-all duration-700 ${featuresAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-sm font-semibold text-sage-dark dark:text-sage tracking-widest uppercase mb-3">What We Offer</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-5 text-charcoal dark:text-cream text-balance">
                How We <span className="editorial text-terracotta">Empower</span> Your Education
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-terracotta to-sage mx-auto mb-6 rounded-full" />
              <p className="text-lg text-muted-foreground dark:text-cream/70 max-w-2xl mx-auto">
                Our platform offers a comprehensive set of tools to help you navigate your educational journey with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`group bg-card dark:bg-charcoal-light/50 p-8 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-500 border border-border/50 dark:border-cream/10 hover:border-terracotta/30 hover:-translate-y-2 ${
                    featuresAnimation.isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: featuresAnimation.isVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <div className="h-14 w-14 bg-gradient-to-br from-terracotta-light to-sage-light dark:from-terracotta/30 dark:to-sage/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal dark:text-cream group-hover:text-terracotta transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-cream/70 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - Journey Steps */}
        <section 
          ref={howItWorksAnimation.ref}
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative"
        >
          {/* Dark mode background */}
          <div className="absolute inset-0 dark:bg-charcoal -mx-4 sm:-mx-6 lg:-mx-8" style={{ left: '-100vw', right: '-100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }} />
          
          <div className="relative">
            <div className={`text-center mb-16 transition-all duration-700 ${howItWorksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-sm font-semibold text-terracotta dark:text-terracotta-light tracking-widest uppercase mb-3">Simple Process</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-5 text-charcoal dark:text-cream text-balance">
                How It <span className="editorial text-sage-dark dark:text-sage">Works</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sage to-terracotta mx-auto mb-6 rounded-full" />
              <p className="text-lg text-muted-foreground dark:text-cream/70 max-w-2xl mx-auto">
                Our simple 3-step process creates your personalized educational roadmap
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connection line - animated gradient */}
            <div className={`hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-1 bg-gradient-to-r from-terracotta via-amber-500 to-sage rounded-full transition-all duration-1000 ${howItWorksAnimation.isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
            
            {[
              { num: 1, title: "Share Your Goals", desc: "Tell us about your educational goals, current skills, and available time." },
              { num: 2, title: "Get Your Roadmap", desc: "Receive a custom learning path with timeline, steps, and resources." },
              { num: 3, title: "Track Your Progress", desc: "Follow your roadmap, track milestones, and adjust as needed." }
            ].map((step, index) => (
              <div 
                key={index} 
                className={`text-center relative transition-all duration-700 ${
                  howItWorksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: howItWorksAnimation.isVisible ? `${300 + index * 200}ms` : '0ms' }}
              >
                <div className="h-[120px] w-[120px] mx-auto mb-6 relative group cursor-default">
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-full opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta to-sage rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                  <div className="absolute inset-2 bg-card dark:bg-charcoal-light rounded-full flex items-center justify-center shadow-warm-md border-2 border-terracotta/20 group-hover:border-terracotta/40 group-hover:scale-105 transition-all">
                    <span className="text-4xl font-heading font-bold text-terracotta dark:text-terracotta-light">{step.num}</span>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal dark:text-cream">{step.title}</h3>
                <p className="text-muted-foreground dark:text-cream/70 max-w-xs mx-auto leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className={`text-center mt-14 transition-all duration-700 delay-700 ${howItWorksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button asChild size="lg" variant="warm" className="group">
              <Link to="/onboarding">
                Create Your Roadmap
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          </div>
        </section>

        {/* Testimonials - Social proof with warmth */}
        <section 
          ref={testimonialsAnimation.ref}
          className="py-24 bg-charcoal dark:bg-charcoal-dark px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-pattern-topo opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-noise" />
          
          <div className="max-w-7xl mx-auto relative">
            <div className={`text-center mb-16 transition-all duration-700 ${testimonialsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-sm font-semibold text-terracotta tracking-widest uppercase mb-3">Success Stories</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-5 text-cream text-balance">
                Voices from the <span className="editorial text-amber-300">Summit</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-terracotta mx-auto mb-6 rounded-full" />
              <p className="text-lg text-cream/70 max-w-2xl mx-auto">
                Hear from working professionals and students who have transformed their educational journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`group bg-charcoal-light/50 backdrop-blur-sm p-8 rounded-2xl border border-cream/10 hover:border-terracotta/40 transition-all duration-500 hover:-translate-y-2 ${
                    testimonialsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: testimonialsAnimation.isVisible ? `${index * 150}ms` : '0ms' }}
                >
                  <div className="mb-5 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-cream/90 italic mb-6 leading-relaxed font-heading text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center pt-4 border-t border-cream/10">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4 ring-2 ring-terracotta/40 group-hover:ring-terracotta transition-all"
                    />
                    <p className="font-semibold text-cream">{testimonial.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Warm invitation */}
        <section 
          ref={ctaAnimation.ref}
          className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-terracotta via-terracotta-dark to-sage-dark text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-pattern-topo opacity-15 pointer-events-none" />
          <div className="absolute inset-0 bg-noise" />
          
          {/* Floating decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float-subtle" />
          
          <div className={`max-w-4xl mx-auto text-center relative transition-all duration-700 ${ctaAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-balance">
              Ready to Begin Your <span className="editorial">Ascent</span>?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/85 max-w-2xl mx-auto leading-relaxed">
              Take the first step toward your educational and career goals today. Your personalized roadmap awaits.
            </p>
            <Button asChild size="xl" className="bg-white text-terracotta hover:bg-cream hover:text-terracotta-dark shadow-warm-xl hover:shadow-2xl transition-all group">
              <Link to="/onboarding">
                Start Your Journey Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      </main> {/* End flex-grow main */}

      <Footer />

      {/* Chat Popup Trigger Button */}
      {!isChatOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 rounded-full p-6 shadow-lg bg-empowerPurple hover:bg-empowerPurple-dark"
          aria-label="Open Chat"
        >
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
            <span className="text-primary-foreground ml-2">Edura</span>
          </div>
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
              className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
              aria-label="Close Chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default Home;
