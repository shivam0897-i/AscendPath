import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSaveRoadmap, useIsRoadmapSaved, SavedRoadmap } from "@/hooks/useSavedRoadmaps";

interface SaveRoadmapButtonProps {
  roadmap: Omit<SavedRoadmap, "savedAt" | "updatedAt">;
  className?: string;
  size?: "default" | "sm" | "lg";
}

const SaveRoadmapButton = ({ roadmap, className, size = "default" }: SaveRoadmapButtonProps) => {
  const saveRoadmap = useSaveRoadmap();
  const isSaved = useIsRoadmapSaved(roadmap.id);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    if (isSaved || saveRoadmap.isPending) return;
    saveRoadmap.mutate(roadmap);
  };

  const buttonSizes = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={handleSave}
        disabled={isSaved || saveRoadmap.isPending}
        className={cn(
          "relative overflow-hidden transition-all duration-300 font-medium",
          buttonSizes[size],
          isSaved
            ? "bg-sage/20 text-sage-dark border-sage/30 hover:bg-sage/30 dark:bg-sage/10 dark:text-sage dark:border-sage/20"
            : "bg-gradient-to-r from-terracotta to-terracotta-dark text-white shadow-warm hover:shadow-warm-md hover:from-terracotta-dark hover:to-terracotta border-0",
          className
        )}
        variant={isSaved ? "outline" : "default"}
      >
        {/* Animated Background Glow */}
        <AnimatePresence>
          {isHovered && !isSaved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.3, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <span className="relative z-10 flex items-center gap-2">
          <AnimatePresence mode="wait">
            {saveRoadmap.isPending ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
              >
                <Loader2 className={cn(iconSizes[size], "animate-spin")} />
              </motion.span>
            ) : isSaved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Check className={iconSizes[size]} />
              </motion.span>
            ) : (
              <motion.span
                key="star"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  y: isHovered ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Star className={cn(iconSizes[size], isHovered && "fill-current")} />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Label */}
          <span>
            {saveRoadmap.isPending 
              ? "Saving..." 
              : isSaved 
                ? "Saved to Dashboard" 
                : "Save Roadmap"
            }
          </span>
        </span>

        {/* Particle effect on save */}
        <AnimatePresence>
          {saveRoadmap.isSuccess && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: 0, 
                    y: 0 
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1,
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 60 - 20,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="absolute w-2 h-2 bg-amber-400 rounded-full pointer-events-none"
                  style={{ left: "50%", top: "50%" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};

export default SaveRoadmapButton;
