
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { CheckCircle2, ChevronDown, Clock, BookOpen, ExternalLink } from "lucide-react"; 
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---
type ResourceForTimeline = {
  id: string;
  title: string;
  type: string;
  platform: string;
  url: string;
  imageUrl: string | null; 
};

type MilestoneForTimeline = {
  id: string; 
  title: string;
  description: string | null;
  resources: ResourceForTimeline[];
  estimatedTime: string | null; 
  completed: boolean;
};

type PhaseForTimeline = {
  title: string;
  description: string | null;
  completionPercentage: number | null; 
  milestones: MilestoneForTimeline[];
};

interface RoadmapTimelineProps {
  phases: PhaseForTimeline[]; 
  onMilestoneToggle: (milestoneId: string, currentStatus: boolean) => void; 
}

const RoadmapTimeline = ({ phases, onMilestoneToggle }: RoadmapTimelineProps) => {
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>(() => {
    const initialState: Record<number, boolean> = {};
    const firstIncompleteIndex = phases.findIndex(p => (p.completionPercentage ?? 0) < 100);
    initialState[firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0] = true;
    return initialState;
  });

  const togglePhase = (index: number) => {
    setOpenPhases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-8">
      {phases.map((phase, phaseIndex) => (
        <div key={phaseIndex} className="relative">
          {/* Timeline connector line */}
          {phaseIndex < phases.length - 1 && (
            <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-terracotta/30 to-sage/30 z-0"></div>
          )}

          <Collapsible open={!!openPhases[phaseIndex]} onOpenChange={() => togglePhase(phaseIndex)}>
            <div className="flex items-start">
              {/* Phase Number Indicator */}
              <div className="relative z-10">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full border-2 transition-all ${
                  phase.completionPercentage === 100
                    ? "bg-sage-light border-sage text-sage-dark"
                    : (phase.completionPercentage ?? 0) > 0
                      ? "bg-terracotta-light border-terracotta text-terracotta"
                      : "bg-cream border-charcoal/20 text-charcoal/60"
                }`}>
                  <span className="text-lg font-heading font-bold">{phaseIndex + 1}</span>
                </div>
              </div>

              {/* Phase Header / Trigger */}
              <div className="ml-4 flex-grow min-w-0 overflow-hidden">
                <CollapsibleTrigger asChild>
                   <Button variant="ghost" className="p-0 h-auto w-full justify-between hover:bg-transparent">
                     <div className="text-left flex-1 min-w-0 pr-2">
                       <div className="flex items-center flex-wrap gap-2">
                         <h3 className="text-lg sm:text-xl font-heading font-semibold text-charcoal dark:text-cream break-words">{phase.title}</h3>
                         <Badge variant="outline" className="text-xs border-terracotta/30 text-terracotta flex-shrink-0">
                           {phase.completionPercentage ?? 0}% complete
                         </Badge>
                       </div>
                       <p className="text-muted-foreground mt-1 text-sm sm:text-base break-words line-clamp-2">{phase.description}</p>
                     </div>
                     <ChevronDown className={`h-5 w-5 transition-transform text-terracotta flex-shrink-0 ${openPhases[phaseIndex] ? "transform rotate-180" : ""}`} />
                   </Button>
                 </CollapsibleTrigger>

                <div className="mt-2">
                  <Progress value={phase.completionPercentage ?? 0} className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-terracotta [&>div]:to-sage" />
                </div>
              </div>
            </div>

            {/* Phase Content (Milestones) */}
            <CollapsibleContent className="ml-6 sm:ml-16 mt-4 space-y-4">
              {phase.milestones.map((milestone) => {
                const isCompleted = milestone.completed;

                return (
                  <Card key={milestone.id} className={`overflow-hidden border-l-4 shadow-warm hover:shadow-warm-md transition-shadow ${
                    isCompleted ? "border-l-sage" : "border-l-terracotta"
                  }`}>
                    <CardContent className="p-3 sm:p-4">
                      {/* Milestone Details */}
                      <div className="min-w-0">
                        <div className="flex items-start mb-1">
                           <Checkbox
                              id={`milestone-check-${milestone.id}`}
                              checked={isCompleted}
                              onCheckedChange={() => onMilestoneToggle(milestone.id, isCompleted)}
                              className="mr-3 mt-1 flex-shrink-0 border-charcoal/30 data-[state=checked]:bg-terracotta data-[state=checked]:border-terracotta"
                           />
                           <label htmlFor={`milestone-check-${milestone.id}`} className="font-medium text-base sm:text-lg cursor-pointer text-charcoal dark:text-cream break-words">
                              {milestone.title}
                           </label>
                        </div>

                        <p className="text-muted-foreground mt-1 text-sm pl-7 break-words"> 
                           {milestone.description}
                        </p>

                        <div className="flex items-center mt-3 text-sm text-muted-foreground pl-7"> 
                          <Clock className="h-4 w-4 mr-1 text-sage" />
                          <span>Est: {milestone.estimatedTime || "N/A"}</span>
                        </div>

                        {/* Resources Section */}
                        {milestone.resources && milestone.resources.length > 0 && (
                          <div className="mt-4 pl-7"> 
                            <h5 className="text-sm font-medium mb-2 text-charcoal dark:text-cream">Resources:</h5>
                            <div className="space-y-2">
                              {milestone.resources.map((resource) => (
                                <a
                                  key={resource.id}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-1.5 pr-2 hover:bg-cream/50 dark:hover:bg-charcoal/30 rounded-md text-sm group"
                                >
                                  <div className="w-8 h-8 rounded overflow-hidden mr-2 flex-shrink-0 bg-cream dark:bg-charcoal/50 flex items-center justify-center">
                                    {resource.imageUrl ? (
                                      <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover" />
                                    ) : (
                                       <BookOpen className="w-5 h-5 text-sage"/>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium group-hover:text-terracotta transition-colors truncate">{resource.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{resource.type} • {resource.platform}</p>
                                  </div>
                                   <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-terracotta ml-2 transition-colors flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};

export default RoadmapTimeline;
