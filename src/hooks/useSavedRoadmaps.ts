import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// --- Types for Saved Roadmaps ---
export type SavedRoadmapStatus = "in-progress" | "draft" | "completed";

export type SavedRoadmap = {
  id: string;
  title: string;
  description: string | null;
  goalRole: string;
  progress: number;
  milestoneCount: number;
  completedMilestones: number;
  phaseCount: number;
  status: SavedRoadmapStatus;
  savedAt: string;
  updatedAt: string;
};

// Storage key for localStorage fallback
const LOCAL_STORAGE_KEY = "ascendpath_saved_roadmaps";

// --- Helper Functions ---
function getStatusFromProgress(progress: number): SavedRoadmapStatus {
  if (progress === 0) return "draft";
  if (progress === 100) return "completed";
  return "in-progress";
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// --- Local Storage Functions ---
function getLocalSavedRoadmaps(): SavedRoadmap[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalSavedRoadmaps(roadmaps: SavedRoadmap[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roadmaps));
}

// --- Supabase Fetch ---
async function fetchSavedRoadmaps(userId: string): Promise<SavedRoadmap[]> {
  const { data, error } = await supabase
    .from("roadmaps")
    .select(`
      id,
      title,
      description,
      created_at,
      updated_at,
      phases(
        id,
        milestones(id, completed)
      )
    `)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((roadmap) => {
    const allMilestones = roadmap.phases?.flatMap((p) => p.milestones || []) || [];
    const completedMilestones = allMilestones.filter((m) => m.completed).length;
    const totalMilestones = allMilestones.length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Extract goal role from title or description
    const goalRole = roadmap.title?.replace(/roadmap/i, "").trim() || "Career Goal";

    return {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      goalRole,
      progress,
      milestoneCount: totalMilestones,
      completedMilestones,
      phaseCount: roadmap.phases?.length || 0,
      status: getStatusFromProgress(progress),
      savedAt: roadmap.created_at,
      updatedAt: roadmap.updated_at,
    };
  });
}

// --- Custom Hooks ---
export function useSavedRoadmaps() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saved-roadmaps", user?.id],
    queryFn: () => {
      if (user?.id) {
        return fetchSavedRoadmaps(user.id);
      }
      // Fallback to localStorage for non-authenticated users
      return Promise.resolve(getLocalSavedRoadmaps());
    },
    enabled: true, // Always enabled - uses localStorage fallback
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

export function useIsRoadmapSaved(roadmapId: string | undefined) {
  const { data: savedRoadmaps } = useSavedRoadmaps();
  
  if (!roadmapId || !savedRoadmaps) return false;
  return savedRoadmaps.some((r) => r.id === roadmapId);
}

export function useSaveRoadmap() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (roadmap: Omit<SavedRoadmap, "savedAt" | "updatedAt">) => {
      if (!user?.id) {
        // Save to localStorage for non-authenticated users
        const existing = getLocalSavedRoadmaps();
        const now = new Date().toISOString();
        const newRoadmap: SavedRoadmap = {
          ...roadmap,
          savedAt: now,
          updatedAt: now,
        };
        
        // Avoid duplicates
        const filtered = existing.filter((r) => r.id !== roadmap.id);
        setLocalSavedRoadmaps([newRoadmap, ...filtered]);
        
        return newRoadmap;
      }

      // For authenticated users, the roadmap should already exist in the database
      // This mutation just confirms it's "saved" (tracked) for the user
      return { ...roadmap, savedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as SavedRoadmap;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-roadmaps"] });
      toast.success("Added to Your Saved Roadmaps", {
        description: "You can access it anytime from your dashboard",
        icon: "⭐",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to save roadmap", {
        description: error.message,
      });
    },
  });
}

export function useDeleteSavedRoadmap() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (roadmapId: string) => {
      if (!user?.id) {
        // Remove from localStorage
        const existing = getLocalSavedRoadmaps();
        const filtered = existing.filter((r) => r.id !== roadmapId);
        setLocalSavedRoadmaps(filtered);
        return roadmapId;
      }

      // For authenticated users, delete from Supabase
      const { error } = await supabase
        .from("roadmaps")
        .delete()
        .eq("id", roadmapId)
        .eq("user_id", user.id);

      if (error) throw error;
      return roadmapId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      toast.success("Roadmap removed", {
        description: "The roadmap has been removed from your saved list",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to remove roadmap", {
        description: error.message,
      });
    },
  });
}

export function useRenameRoadmap() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ roadmapId, newTitle }: { roadmapId: string; newTitle: string }) => {
      if (!user?.id) {
        // Update in localStorage
        const existing = getLocalSavedRoadmaps();
        const updated = existing.map((r) =>
          r.id === roadmapId ? { ...r, title: newTitle, updatedAt: new Date().toISOString() } : r
        );
        setLocalSavedRoadmaps(updated);
        return { roadmapId, newTitle };
      }

      // Update in Supabase
      const { error } = await supabase
        .from("roadmaps")
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq("id", roadmapId)
        .eq("user_id", user.id);

      if (error) throw error;
      return { roadmapId, newTitle };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      toast.success("Roadmap renamed");
    },
    onError: (error: Error) => {
      toast.error("Failed to rename roadmap", {
        description: error.message,
      });
    },
  });
}

// Export helper
export { getRelativeTime };
