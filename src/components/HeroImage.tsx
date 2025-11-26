
import { useEffect, useRef } from "react";
import { Mountain, BookOpen, Target, Compass, Award, TrendingUp } from "lucide-react";

interface HeroImageProps {
  onClick?: () => void;
}

const HeroImage: React.FC<HeroImageProps> = ({ onClick }) => {
  return (
    <div className="relative w-full aspect-square max-w-[340px] lg:max-w-[400px] mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-terracotta/20 via-transparent to-sage/20 dark:from-terracotta/30 dark:to-sage/30 blur-2xl scale-110" />
      
      {/* Main visual container - centered logo with orbital elements */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Orbital track - subtle ring */}
        <div className="absolute inset-4 rounded-full border border-dashed border-charcoal/10 dark:border-cream/10" />
        <div className="absolute inset-10 rounded-full border border-charcoal/5 dark:border-cream/5" />
        
        {/* Central logo */}
        <div className="relative z-10">
          <div className="relative bg-gradient-to-br from-cream to-white dark:from-charcoal-light dark:to-charcoal p-1.5 rounded-full shadow-warm-lg">
            <img 
              src="/images/logo.jpg" 
              alt="AscendPath" 
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover ring-4 ring-terracotta/20 dark:ring-terracotta/40" 
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
            />
          </div>
          
          {/* Achievement badge - positioned intentionally */}
          <div className="absolute -top-2 -right-2 bg-terracotta text-white p-2.5 rounded-xl shadow-warm-md">
            <Award className="w-5 h-5" />
          </div>
        </div>
        
        {/* Orbital milestone markers - positioned at cardinal points for narrative */}
        {/* Top - Learning/Knowledge */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-terracotta-light to-amber-100 dark:from-terracotta/40 dark:to-amber-900/40 p-3 rounded-xl shadow-warm border border-terracotta/10 dark:border-terracotta/30">
            <BookOpen className="w-5 h-5 text-terracotta-dark dark:text-terracotta-light" />
          </div>
        </div>
        
        {/* Right - Goals/Target */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-br from-sage-light to-green-100 dark:from-sage/40 dark:to-green-900/40 p-3 rounded-xl shadow-warm border border-sage/10 dark:border-sage/30">
            <Target className="w-5 h-5 text-sage-dark dark:text-sage" />
          </div>
        </div>
        
        {/* Bottom - Progress/Growth */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-cream to-stone-100 dark:from-charcoal-light dark:to-charcoal p-3 rounded-xl shadow-warm border border-charcoal/10 dark:border-cream/15">
            <TrendingUp className="w-5 h-5 text-charcoal dark:text-cream" />
          </div>
        </div>
        
        {/* Left - Direction/Guidance */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/30 p-3 rounded-xl shadow-warm border border-amber-200/40 dark:border-amber-500/30">
            <Compass className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default HeroImage;
