import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface ProfileStats {
    totalMilestones: number;
    completedMilestones: number;
    savedRoadmaps: number;
    completedRoadmaps: number;
    currentStreak: number;
    overallProgress: number;
    joinDate: Date | null;
    totalResources: number;
}

export function useProfileStats() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['profileStats', user?.id],
        queryFn: async (): Promise<ProfileStats> => {
            if (!user?.id) {
                return {
                    totalMilestones: 0,
                    completedMilestones: 0,
                    savedRoadmaps: 0,
                    completedRoadmaps: 0,
                    currentStreak: 0,
                    overallProgress: 0,
                    joinDate: null,
                    totalResources: 0,
                };
            }

            // Fetch all roadmaps for the user
            const { data: roadmaps, error: roadmapsError } = await supabase
                .from('roadmaps')
                .select(`
          id,
          created_at,
          phases (
            id,
            completion_percentage,
            milestones (
              id,
              completed,
              resources (id)
            )
          )
        `)
                .eq('user_id', user.id);

            if (roadmapsError) {
                console.error('Error fetching roadmaps for stats:', roadmapsError);
                throw roadmapsError;
            }

            // Fetch profile for join date (learning_streak added by migration)
            const { data: profile } = await supabase
                .from('profiles')
                .select('created_at')
                .eq('id', user.id)
                .single();

            // Calculate stats
            let totalMilestones = 0;
            let completedMilestones = 0;
            let totalResources = 0;
            let completedRoadmaps = 0;

            roadmaps?.forEach(roadmap => {
                let roadmapComplete = true;

                roadmap.phases?.forEach(phase => {
                    phase.milestones?.forEach(milestone => {
                        totalMilestones++;
                        if (milestone.completed) {
                            completedMilestones++;
                        } else {
                            roadmapComplete = false;
                        }
                        totalResources += milestone.resources?.length || 0;
                    });
                });

                if (roadmapComplete && totalMilestones > 0) {
                    completedRoadmaps++;
                }
            });

            const overallProgress = totalMilestones > 0
                ? Math.round((completedMilestones / totalMilestones) * 100)
                : 0;

            return {
                totalMilestones,
                completedMilestones,
                savedRoadmaps: roadmaps?.length || 0,
                completedRoadmaps,
                currentStreak: 0, // Will use learning_streak after migration
                overallProgress,
                joinDate: profile?.created_at ? new Date(profile.created_at) : null,
                totalResources,
            };
        },
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
