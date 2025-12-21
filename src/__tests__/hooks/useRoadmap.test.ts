/**
 * Tests for useRoadmap.ts helper functions
 * 
 * Tests the pure helper functions that don't require React context.
 * Hook tests with mocked Supabase require additional setup.
 */
import { describe, it, expect } from 'vitest';
import {
    calculateOverallProgress,
    transformPhasesForTimeline,
    type FullRoadmapFromSupabase
} from '@/hooks/useRoadmap';

// Mock data matching Supabase schema
const createMockRoadmap = (phases: FullRoadmapFromSupabase['phases']): FullRoadmapFromSupabase => ({
    id: 'roadmap-1',
    user_id: 'user-1',
    title: 'Test Roadmap',
    description: 'Test description',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    phases,
});

const createMockPhase = (
    id: string,
    milestones: FullRoadmapFromSupabase['phases'][0]['milestones'],
    completion_percentage: number | null = null
) => ({
    id,
    roadmap_id: 'roadmap-1',
    title: `Phase ${id}`,
    description: 'Test phase',
    position: 1,
    completion_percentage,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    milestones,
});

const createMockMilestone = (id: string, completed: boolean) => ({
    id,
    phase_id: 'phase-1',
    title: `Milestone ${id}`,
    description: 'Test milestone',
    estimated_time: '2 weeks',
    position: 1,
    completed,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    resources: [
        {
            id: 'resource-1',
            milestone_id: id,
            title: 'Test Resource',
            type: 'Course',
            platform: 'Coursera',
            url: 'https://example.com',
            image_url: 'https://example.com/image.jpg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ],
});

describe('calculateOverallProgress', () => {
    it('returns 0 for null roadmap', () => {
        expect(calculateOverallProgress(null)).toBe(0);
    });

    it('returns 0 for undefined roadmap', () => {
        expect(calculateOverallProgress(undefined)).toBe(0);
    });

    it('returns 0 for roadmap with no phases', () => {
        const roadmap = createMockRoadmap([]);
        expect(calculateOverallProgress(roadmap)).toBe(0);
    });

    it('returns 0 for roadmap with no milestones', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', []),
        ]);
        expect(calculateOverallProgress(roadmap)).toBe(0);
    });

    it('returns 0 when no milestones are completed', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [
                createMockMilestone('m1', false),
                createMockMilestone('m2', false),
            ]),
        ]);
        expect(calculateOverallProgress(roadmap)).toBe(0);
    });

    it('returns 100 when all milestones are completed', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [
                createMockMilestone('m1', true),
                createMockMilestone('m2', true),
            ]),
        ]);
        expect(calculateOverallProgress(roadmap)).toBe(100);
    });

    it('calculates correct percentage for partial completion', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [
                createMockMilestone('m1', true),
                createMockMilestone('m2', false),
                createMockMilestone('m3', false),
                createMockMilestone('m4', false),
            ]),
        ]);
        // 1 out of 4 = 25%
        expect(calculateOverallProgress(roadmap)).toBe(25);
    });

    it('calculates correct percentage across multiple phases', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [
                createMockMilestone('m1', true),
                createMockMilestone('m2', true),
            ]),
            createMockPhase('phase-2', [
                createMockMilestone('m3', false),
                createMockMilestone('m4', false),
            ]),
        ]);
        // 2 out of 4 = 50%
        expect(calculateOverallProgress(roadmap)).toBe(50);
    });
});

describe('transformPhasesForTimeline', () => {
    it('returns empty array for null roadmap', () => {
        expect(transformPhasesForTimeline(null)).toEqual([]);
    });

    it('returns empty array for undefined roadmap', () => {
        expect(transformPhasesForTimeline(undefined)).toEqual([]);
    });

    it('transforms phase with correct field mapping', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [createMockMilestone('m1', true)], 50),
        ]);

        const result = transformPhasesForTimeline(roadmap);

        expect(result).toHaveLength(1);
        expect(result[0].completionPercentage).toBe(50);
        expect(result[0].id).toBe('phase-1');
    });

    it('transforms milestone estimated_time to estimatedTime', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [createMockMilestone('m1', false)]),
        ]);

        const result = transformPhasesForTimeline(roadmap);
        const milestone = result[0].milestones[0];

        expect(milestone.estimatedTime).toBe('2 weeks');
        expect(milestone.completed).toBe(false);
        expect(milestone.id).toBe('m1');
    });

    it('transforms resource image_url to imageUrl', () => {
        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [createMockMilestone('m1', true)]),
        ]);

        const result = transformPhasesForTimeline(roadmap);
        const resource = result[0].milestones[0].resources[0];

        expect(resource.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('handles milestones with no resources', () => {
        const milestone = createMockMilestone('m1', false);
        milestone.resources = [];

        const roadmap = createMockRoadmap([
            createMockPhase('phase-1', [milestone]),
        ]);

        const result = transformPhasesForTimeline(roadmap);
        expect(result[0].milestones[0].resources).toEqual([]);
    });
});
