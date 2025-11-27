import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

// --- Types Fetched from Supabase ---
type Profile = Database['public']['Tables']['profiles']['Row'];
type RoadmapFromSupabase = Database['public']['Tables']['roadmaps']['Row'];
type PhaseFromSupabase = Database['public']['Tables']['phases']['Row'];
type MilestoneFromSupabase = Database['public']['Tables']['milestones']['Row'];
type ResourceFromSupabase = Database['public']['Tables']['resources']['Row'];

// Combined type for the state
export type FullRoadmapFromSupabase = RoadmapFromSupabase & {
  phases: (PhaseFromSupabase & {
    milestones: (MilestoneFromSupabase & {
      resources: ResourceFromSupabase[];
    })[];
  })[];
};

// --- Types Expected by Components ---
export type ResourceForTimeline = Omit<ResourceFromSupabase, 'image_url'> & {
  imageUrl: string | null;
};

export type MilestoneForTimeline = Omit<MilestoneFromSupabase, 'estimated_time'> & {
  id: string;
  estimatedTime: string | null;
  completed: boolean;
  resources: ResourceForTimeline[];
};

export type PhaseForTimeline = Omit<PhaseFromSupabase, 'completion_percentage'> & {
  id: string;
  completionPercentage: number | null;
  milestones: MilestoneForTimeline[];
};

// Fetch profile query
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Fetch roadmap query - either by ID or get the latest one
async function fetchRoadmap(userId: string, roadmapId?: string): Promise<FullRoadmapFromSupabase | null> {
  let query = supabase
    .from('roadmaps')
    .select(`*, phases(*, milestones(*, resources(*)))`)
    .eq('user_id', userId);

  if (roadmapId) {
    // Fetch specific roadmap by ID
    query = query.eq('id', roadmapId);
  } else {
    // Fetch the most recent roadmap
    query = query.order('created_at', { ascending: false }).limit(1);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data as FullRoadmapFromSupabase | null;
}

// Custom hook for profile data
export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Custom hook for roadmap data
export function useRoadmap(roadmapId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['roadmap', user?.id, roadmapId],
    queryFn: () => fetchRoadmap(user!.id, roadmapId),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Mutation hook for toggling milestone completion
export function useMilestoneToggle(roadmapId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ milestoneId, newStatus }: { milestoneId: string; newStatus: boolean }) => {
      const { error } = await supabase
        .from('milestones')
        .update({ completed: newStatus, updated_at: new Date().toISOString() })
        .eq('id', milestoneId);

      if (error) throw error;
      return { milestoneId, newStatus };
    },
    onMutate: async ({ milestoneId, newStatus }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['roadmap', user?.id, roadmapId] });

      // Snapshot the previous value
      const previousRoadmap = queryClient.getQueryData<FullRoadmapFromSupabase>(['roadmap', user?.id, roadmapId]);

      // Optimistically update the roadmap
      if (previousRoadmap) {
        const updatedRoadmap = {
          ...previousRoadmap,
          phases: previousRoadmap.phases.map(phase => {
            const milestoneIndex = phase.milestones.findIndex(m => m.id === milestoneId);
            if (milestoneIndex !== -1) {
              const updatedMilestones = [...phase.milestones];
              updatedMilestones[milestoneIndex] = {
                ...updatedMilestones[milestoneIndex],
                completed: newStatus,
                updated_at: new Date().toISOString()
              };

              // Update phase completion percentage
              const totalM = updatedMilestones.length;
              const completedM = updatedMilestones.filter(m => m.completed).length;
              const newPhasePercentage = totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;

              return {
                ...phase,
                milestones: updatedMilestones,
                completion_percentage: newPhasePercentage
              };
            }
            return phase;
          })
        };

        queryClient.setQueryData(['roadmap', user?.id, roadmapId], updatedRoadmap);
      }

      return { previousRoadmap };
    },
    onSuccess: (_, { newStatus }) => {
      toast.success(newStatus ? "Milestone completed!" : "Milestone marked incomplete.");
    },
    onError: (error: Error, _, context) => {
      // Rollback to previous value on error
      if (context?.previousRoadmap) {
        queryClient.setQueryData(['roadmap', user?.id, roadmapId], context.previousRoadmap);
      }
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

// Helper to calculate overall progress
export function calculateOverallProgress(roadmap: FullRoadmapFromSupabase | null | undefined): number {
  if (!roadmap?.phases) return 0;

  const milestones = roadmap.phases.flatMap(p => p.milestones || []);
  const total = milestones.length;
  if (total === 0) return 0;

  const completed = milestones.filter(m => m.completed === true).length;
  return Math.round((completed / total) * 100);
}

// Helper to transform phases for timeline component
export function transformPhasesForTimeline(roadmap: FullRoadmapFromSupabase | null | undefined): PhaseForTimeline[] {
  if (!roadmap?.phases) return [];

  return roadmap.phases.map(phase => ({
    ...phase,
    completionPercentage: phase.completion_percentage,
    milestones: phase.milestones?.map(milestone => ({
      ...milestone,
      estimatedTime: milestone.estimated_time,
      completed: milestone.completed === true,
      resources: milestone.resources?.map(resource => ({
        ...resource,
        imageUrl: resource.image_url
      })) || []
    })) || []
  }));
}

// Profile helper functions
export const profileHelpers = {
  getGoal: (profile: Profile | null): string => {
    return profile?.goals?.find(g => g.toLowerCase().startsWith("achieve goal:"))?.split(":").slice(1).join(":").trim()
      || profile?.goals?.[0]
      || "-";
  },

  getFieldLabel: (profile: Profile | null): string => {
    return profile?.skills?.find(s => s.toLowerCase().startsWith("field:"))?.split(":").slice(1).join(":").trim()
      || profile?.skills?.[0]
      || "-";
  },

  getTimelineLabel: (profile: Profile | null): string => {
    return profile?.goals?.find(g => g.toLowerCase().includes("within"))?.split("within").pop()?.trim()
      || "-";
  },

  getExperienceLabel: (profile: Profile | null): string => {
    return profile?.skills?.find(s => s.toLowerCase().startsWith("experience:"))?.split(":").slice(1).join(":").trim()
      || "-";
  },

  getBackgroundLabel: (profile: Profile | null): string => {
    return profile?.background?.replace(/_/g, ' ').replace(/ \w/g, l => l.toUpperCase())
      || "N/A";
  }
};
