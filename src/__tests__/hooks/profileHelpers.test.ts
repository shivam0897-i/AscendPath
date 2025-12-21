/**
 * Tests for profileHelpers
 * 
 * CRITICAL: These tests lock in the CURRENT behavior before refactoring.
 * Do NOT change expected values without understanding impact.
 */
import { describe, it, expect } from 'vitest';
import { profileHelpers } from '@/hooks/useRoadmap';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

describe('profileHelpers', () => {
    // Test data matching current format from Onboarding.tsx
    const mockProfileComplete: Profile = {
        id: 'test-user',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        goals: ['Learn about Technology', 'Achieve goal: Become ML engineer within 6 months'],
        skills: ['Field: Technology', 'Experience: beginner'],
        background: 'bachelor',
        time_available: '10 hours/week',
        challenges: ['Limited time'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const mockProfileMinimal: Profile = {
        id: 'test-user-2',
        first_name: null,
        last_name: null,
        email: null,
        goals: null,
        skills: null,
        background: null,
        time_available: null,
        challenges: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const mockProfilePartial: Profile = {
        id: 'test-user-3',
        first_name: 'Partial',
        last_name: null,
        email: 'partial@example.com',
        goals: ['Some random goal without achieve prefix'],
        skills: ['Some skill without field prefix'],
        background: 'high_school',
        time_available: null,
        challenges: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    describe('getGoal', () => {
        it('extracts goal from "Achieve goal:" format', () => {
            const result = profileHelpers.getGoal(mockProfileComplete);
            // Note: Current implementation includes "within X" - this is the CURRENT behavior
            expect(result).toBe('Become ML engineer within 6 months');
        });

        it('falls back to first goal if no "Achieve goal:" format', () => {
            const result = profileHelpers.getGoal(mockProfilePartial);
            expect(result).toBe('Some random goal without achieve prefix');
        });

        it('returns "-" for null profile', () => {
            const result = profileHelpers.getGoal(null);
            expect(result).toBe('-');
        });

        it('returns "-" for null goals', () => {
            const result = profileHelpers.getGoal(mockProfileMinimal);
            expect(result).toBe('-');
        });
    });

    describe('getFieldLabel', () => {
        it('extracts field from "Field:" format', () => {
            const result = profileHelpers.getFieldLabel(mockProfileComplete);
            expect(result).toBe('Technology');
        });

        it('falls back to first skill if no "Field:" format', () => {
            const result = profileHelpers.getFieldLabel(mockProfilePartial);
            expect(result).toBe('Some skill without field prefix');
        });

        it('returns "-" for null profile', () => {
            const result = profileHelpers.getFieldLabel(null);
            expect(result).toBe('-');
        });

        it('returns "-" for null skills', () => {
            const result = profileHelpers.getFieldLabel(mockProfileMinimal);
            expect(result).toBe('-');
        });
    });

    describe('getTimelineLabel', () => {
        it('extracts timeline from "within X" format', () => {
            const result = profileHelpers.getTimelineLabel(mockProfileComplete);
            expect(result).toBe('6 months');
        });

        it('returns "-" if no "within" in goals', () => {
            const result = profileHelpers.getTimelineLabel(mockProfilePartial);
            expect(result).toBe('-');
        });

        it('returns "-" for null profile', () => {
            const result = profileHelpers.getTimelineLabel(null);
            expect(result).toBe('-');
        });
    });

    describe('getExperienceLabel', () => {
        it('extracts experience from "Experience:" format', () => {
            const result = profileHelpers.getExperienceLabel(mockProfileComplete);
            expect(result).toBe('beginner');
        });

        it('returns "-" if no "Experience:" in skills', () => {
            const result = profileHelpers.getExperienceLabel(mockProfilePartial);
            expect(result).toBe('-');
        });

        it('returns "-" for null profile', () => {
            const result = profileHelpers.getExperienceLabel(null);
            expect(result).toBe('-');
        });
    });

    describe('getBackgroundLabel', () => {
        it('formats background with proper capitalization', () => {
            const result = profileHelpers.getBackgroundLabel(mockProfileComplete);
            expect(result).toBe('bachelor');
        });

        it('replaces underscores with spaces and capitalizes', () => {
            const result = profileHelpers.getBackgroundLabel(mockProfilePartial);
            // high_school -> "high school" then capitalize after spaces -> "high School"
            // Note: Current regex only capitalizes after space, not first char
            expect(result).toBe('high School');
        });

        it('returns "N/A" for null profile', () => {
            const result = profileHelpers.getBackgroundLabel(null);
            expect(result).toBe('N/A');
        });

        it('returns "N/A" for null background', () => {
            const result = profileHelpers.getBackgroundLabel(mockProfileMinimal);
            expect(result).toBe('N/A');
        });
    });

    describe('edge cases - semantic string variations', () => {
        it('handles case insensitive "achieve goal" prefix', () => {
            const profile: Profile = {
                ...mockProfileMinimal,
                goals: ['ACHIEVE GOAL: Test uppercase within 3 months'],
            };
            const result = profileHelpers.getGoal(profile);
            expect(result).toBe('Test uppercase within 3 months');
        });

        it('handles multiple colons in goal', () => {
            const profile: Profile = {
                ...mockProfileMinimal,
                goals: ['Achieve goal: Learn Python: The Basics within 1 month'],
            };
            const result = profileHelpers.getGoal(profile);
            // Current implementation joins with ":"
            expect(result).toBe('Learn Python: The Basics within 1 month');
        });

        it('handles goals without "within" for timeline', () => {
            const profile: Profile = {
                ...mockProfileMinimal,
                goals: ['Achieve goal: Eventually learn something'],
            };
            const result = profileHelpers.getTimelineLabel(profile);
            expect(result).toBe('-');
        });
    });
});
