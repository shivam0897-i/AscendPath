
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
            <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 z-0"></div>
          )}

          <Collapsible open={!!openPhases[phaseIndex]} onOpenChange={() => togglePhase(phaseIndex)}>
            <div className="flex items-start">
              {/* Phase Number Indicator */}
              <div className="relative z-10">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full border-2 ${
                  phase.completionPercentage === 100
                    ? "bg-green-100 border-green-500 text-green-500"
                    : (phase.completionPercentage ?? 0) > 0
                      ? "bg-empowerPurple-light border-empowerPurple text-empowerPurple"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                }`}>
                  <span className="text-lg font-bold">{phaseIndex + 1}</span>
                </div>
              </div>

              {/* Phase Header / Trigger */}
              <div className="ml-4 flex-grow">
                <CollapsibleTrigger asChild>
                   <Button variant="ghost" className="p-0 h-auto w-full justify-between hover:bg-transparent">
                     <div className="text-left">
                       <div className="flex items-center">
                         <h3 className="text-xl font-semibold mr-2">{phase.title}</h3>
                         <Badge variant="outline" className="text-xs">
                           {phase.completionPercentage ?? 0}% complete
                         </Badge>
                       </div>
                       <p className="text-gray-600 mt-1">{phase.description}</p>
                     </div>
                     <ChevronDown className={`h-5 w-5 transition-transform ${openPhases[phaseIndex] ? "transform rotate-180" : ""}`} />
                   </Button>
                 </CollapsibleTrigger>

                <div className="mt-2">
                  <Progress value={phase.completionPercentage ?? 0} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* Phase Content (Milestones) */}
            <CollapsibleContent className="ml-16 mt-4 space-y-4">
              {phase.milestones.map((milestone) => {
                const isCompleted = milestone.completed;

                return (
                  <Card key={milestone.id} className={`overflow-hidden border-l-4 ${
                    isCompleted ? "border-l-green-500" : "border-l-empowerPurple"
                  }`}>
                    <CardContent className="p-4 flex items-start justify-between">
                      {/* Milestone Details */}
                      <div className="flex-grow mr-4">
                        <div className="flex items-center mb-1">
                           <Checkbox
                              id={`milestone-check-${milestone.id}`}
                              checked={isCompleted}
                              onCheckedChange={() => onMilestoneToggle(milestone.id, isCompleted)}
                              className="mr-3 border-gray-400 data-[state=checked]:bg-empowerPurple data-[state=checked]:border-empowerPurple"
                           />
                           <label htmlFor={`milestone-check-${milestone.id}`} className="font-medium text-lg cursor-pointer">
                              {milestone.title}
                           </label>
                        </div>

                        <p className="text-gray-600 mt-1 text-sm pl-7"> 
                           {milestone.description}
                        </p>

                        <div className="flex items-center mt-3 text-sm text-gray-500 pl-7"> 
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Est: {milestone.estimatedTime || "N/A"}</span>
                        </div>

                        {/* Resources Section */}
                        {milestone.resources && milestone.resources.length > 0 && (
                          <div className="mt-4 pl-7"> 
                            <h5 className="text-sm font-medium mb-2">Resources:</h5>
                            <div className="space-y-2">
                              {milestone.resources.map((resource) => (
                                <a
                                  key={resource.id}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-1.5 pr-2 hover:bg-gray-50 rounded-md text-sm group"
                                >
                                  <div className="w-8 h-8 rounded overflow-hidden mr-2 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                    {resource.imageUrl ? (
                                      <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover" />
                                    ) : (
                                       <BookOpen className="w-5 h-5 text-gray-400"/> // Use the imported icon
                                    )}
                                  </div>
                                  <div className="flex-grow">
                                    <p className="font-medium group-hover:text-empowerPurple transition-colors">{resource.title}</p>
                                    <p className="text-xs text-gray-500">{resource.type} • {resource.platform}</p>
                                  </div>
                                   {/* Use the imported icon */}
                                   <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-empowerPurple ml-2 transition-colors" />
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
