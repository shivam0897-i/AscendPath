
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, ChevronDown, Clock } from "lucide-react";

type Resource = {
  title: string;
  type: string;
  platform: string;
  url: string;
  imageUrl: string;
};

type Milestone = {
  title: string;
  description: string;
  resources: Resource[];
  estimatedTime: string;
  completed: boolean;
};

type Phase = {
  title: string;
  description: string;
  completionPercentage: number;
  milestones: Milestone[];
};

interface RoadmapTimelineProps {
  phases: Phase[];
}

const RoadmapTimeline = ({ phases }: RoadmapTimelineProps) => {
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    0: true, // Open the first phase by default
  });

  const togglePhase = (index: number) => {
    setOpenPhases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  const toggleMilestoneCompletion = (phaseIndex: number, milestoneIndex: number) => {
    const key = `${phaseIndex}-${milestoneIndex}`;
    setCompletedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
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
          
          <Collapsible open={openPhases[phaseIndex]} onOpenChange={() => togglePhase(phaseIndex)}>
            <div className="flex items-start">
              <div className="relative z-10">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full border-2 ${
                  phase.completionPercentage === 100 
                    ? "bg-green-100 border-green-500 text-green-500" 
                    : phase.completionPercentage > 0 
                      ? "bg-empowerPurple-light border-empowerPurple text-empowerPurple" 
                      : "bg-gray-100 border-gray-300 text-gray-500"
                }`}>
                  <span className="text-lg font-bold">{phaseIndex + 1}</span>
                </div>
              </div>
              
              <div className="ml-4 flex-grow">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto w-full justify-between hover:bg-transparent">
                    <div className="text-left">
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold mr-2">{phase.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {phase.completionPercentage}% complete
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-1">{phase.description}</p>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openPhases[phaseIndex] ? "transform rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                
                <div className="mt-2">
                  <Progress value={phase.completionPercentage} className="h-1.5" />
                </div>
              </div>
            </div>
            
            <CollapsibleContent className="ml-16 mt-4 space-y-4">
              {phase.milestones.map((milestone, milestoneIndex) => {
                const isCompleted = completedMilestones[`${phaseIndex}-${milestoneIndex}`] || milestone.completed;
                
                return (
                  <Card key={milestoneIndex} className={`border-l-4 ${
                    isCompleted ? "border-l-green-500" : "border-l-empowerPurple"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <h4 className="font-medium text-lg">{milestone.title}</h4>
                          <p className="text-gray-600 mt-1 text-sm">{milestone.description}</p>
                          
                          <div className="flex items-center mt-3 text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" /> 
                            <span>Estimated time: {milestone.estimatedTime}</span>
                          </div>
                          
                          {milestone.resources.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-2">Resources:</h5>
                              <div className="space-y-2">
                                {milestone.resources.map((resource, i) => (
                                  <a 
                                    key={i} 
                                    href={resource.url}
                                    className="flex items-center p-2 hover:bg-gray-50 rounded-md text-sm"
                                  >
                                    <div className="w-8 h-8 rounded overflow-hidden mr-3 flex-shrink-0">
                                      <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{resource.title}</p>
                                      <p className="text-xs text-gray-500">{resource.type} • {resource.platform}</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant={isCompleted ? "outline" : "default"} 
                          size="sm"
                          className={`ml-4 flex-shrink-0 ${
                            isCompleted 
                              ? "border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                              : "bg-empowerPurple hover:bg-empowerPurple-dark"
                          }`}
                          onClick={() => toggleMilestoneCompletion(phaseIndex, milestoneIndex)}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Completed
                            </>
                          ) : (
                            "Mark Complete"
                          )}
                        </Button>
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
