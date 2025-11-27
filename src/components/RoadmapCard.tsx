import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Target,
  Flag,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SavedRoadmap, getRelativeTime, useDeleteSavedRoadmap, useRenameRoadmap } from "@/hooks/useSavedRoadmaps";

interface RoadmapCardProps {
  roadmap: SavedRoadmap;
  index?: number;
}

const RoadmapCard = ({ roadmap, index = 0 }: RoadmapCardProps) => {
  const navigate = useNavigate();
  const deleteRoadmap = useDeleteSavedRoadmap();
  const renameRoadmap = useRenameRoadmap();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(roadmap.title);

  const statusConfig = {
    "in-progress": {
      label: "In Progress",
      className: "bg-terracotta/10 text-terracotta border-terracotta/20",
      icon: Target,
    },
    draft: {
      label: "Draft",
      className: "bg-muted text-muted-foreground border-border",
      icon: Clock,
    },
    completed: {
      label: "Completed",
      className: "bg-sage/10 text-sage-dark border-sage/20",
      icon: CheckCircle2,
    },
  };

  const status = statusConfig[roadmap.status];
  const StatusIcon = status.icon;

  const handleResume = () => {
    navigate(`/dashboard/${roadmap.id}`);
  };

  const handleDelete = () => {
    deleteRoadmap.mutate(roadmap.id);
    setShowDeleteDialog(false);
  };

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== roadmap.title) {
      renameRoadmap.mutate({ roadmapId: roadmap.id, newTitle: newTitle.trim() });
    }
    setShowRenameDialog(false);
  };

  // Generate milestone badges (show first 3-4 phases)
  const milestoneBadges = Array.from({ length: Math.min(roadmap.phaseCount, 4) }, (_, i) => ({
    label: `Phase ${i + 1}`,
    completed: i < Math.floor((roadmap.progress / 100) * roadmap.phaseCount),
  }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1]
        }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Card 
          variant="warm"
          className="h-full flex flex-col group cursor-pointer relative overflow-hidden"
          onClick={handleResume}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-terracotta/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sage/5 to-transparent rounded-tr-full pointer-events-none" />
          
          {/* Upward flowing line decoration */}
          <motion.div 
            className="absolute right-4 bottom-0 w-0.5 bg-gradient-to-t from-terracotta/30 via-sage/20 to-transparent"
            initial={{ height: 0 }}
            whileInView={{ height: "60%" }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <CardHeader className="pb-3 relative">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Status Badge */}
                <Badge 
                  variant="outline" 
                  className={cn("mb-2 text-xs", status.className)}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>

                {/* Goal Title */}
                <h3 className="font-heading font-semibold text-lg text-charcoal dark:text-cream line-clamp-2 group-hover:text-terracotta transition-colors">
                  {roadmap.goalRole || roadmap.title}
                </h3>

                {/* Description if available */}
                {roadmap.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {roadmap.description}
                  </p>
                )}
              </div>

              {/* Context Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-terracotta/10 hover:text-terracotta"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewTitle(roadmap.title);
                      setShowRenameDialog(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="flex-1 pb-3 relative">
            {/* Progress Section */}
            <div className="space-y-3">
              {/* Progress Bar with Animation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-terracotta">{roadmap.progress}%</span>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ originX: 0 }}
                >
                  <Progress 
                    value={roadmap.progress} 
                    className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-terracotta [&>div]:to-sage" 
                  />
                </motion.div>
              </div>

              {/* Milestone Badges */}
              <div className="flex flex-wrap gap-1.5">
                {milestoneBadges.map((badge, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={cn(
                      "text-xs transition-colors",
                      badge.completed
                        ? "bg-sage/10 text-sage-dark border-sage/30"
                        : "bg-muted/50 text-muted-foreground border-border/50"
                    )}
                  >
                    {badge.completed && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {badge.label}
                  </Badge>
                ))}
                {roadmap.phaseCount > 4 && (
                  <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">
                    +{roadmap.phaseCount - 4} more
                  </Badge>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flag className="h-3.5 w-3.5 text-sage" />
                  <span>{roadmap.completedMilestones}/{roadmap.milestoneCount} milestones</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
            {/* Saved Date */}
            <span className="text-xs text-muted-foreground">
              Saved {getRelativeTime(roadmap.savedAt)}
            </span>

            {/* Resume Button */}
            <Button
              size="sm"
              className="group/btn bg-terracotta hover:bg-terracotta-dark text-white shadow-warm hover:shadow-warm-md"
              onClick={(e) => {
                e.stopPropagation();
                handleResume();
              }}
            >
              <span>Resume</span>
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </CardFooter>

          {/* Completion celebration effect */}
          {roadmap.status === "completed" && (
            <motion.div
              className="absolute top-2 right-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Remove from Saved Roadmaps?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{roadmap.title}" from your saved roadmaps. Your progress will be lost and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRoadmap.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Rename Roadmap</DialogTitle>
            <DialogDescription>
              Give your roadmap a new name to better describe your career goal.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter roadmap name"
              className="focus-visible:ring-terracotta"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRename}
              disabled={!newTitle.trim() || renameRoadmap.isPending}
              className="bg-terracotta hover:bg-terracotta-dark"
            >
              {renameRoadmap.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoadmapCard;
