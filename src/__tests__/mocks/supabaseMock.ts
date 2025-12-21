/**
 * Supabase Client Mock for Testing
 * 
 * Provides a mock implementation of the Supabase client
 * that can be used in unit tests without hitting the real API.
 */
import { vi } from 'vitest';

// Mock user data
export const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {
        first_name: 'Test',
        last_name: 'User',
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
};

// Mock session
export const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser,
};

// Mock profile data (current format with semantic strings)
export const mockProfileOldFormat = {
    id: 'test-user-id',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    goals: ['Learn about Technology', 'Achieve goal: Become ML engineer within 6 months'],
    skills: ['Field: Technology', 'Experience: beginner'],
    background: 'bachelor',
    time_available: '10 hours/week',
    challenges: 'Limited time',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

// Mock profile data (new format with structured columns - for future)
export const mockProfileNewFormat = {
    ...mockProfileOldFormat,
    goal_field: 'Technology',
    goal_description: 'Become ML engineer',
    goal_timeline: '6 months',
    experience_level: 'beginner',
};

// Mock roadmap data
export const mockRoadmap = {
    id: 'test-roadmap-id',
    user_id: 'test-user-id',
    title: 'Machine Learning Engineer Roadmap',
    description: 'A personalized learning path',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    phases: [
        {
            id: 'phase-1',
            roadmap_id: 'test-roadmap-id',
            title: 'Fundamentals',
            description: 'Learn the basics',
            position: 1,
            completion_percentage: 50,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            milestones: [
                {
                    id: 'milestone-1',
                    phase_id: 'phase-1',
                    title: 'Python Basics',
                    description: 'Learn Python fundamentals',
                    estimated_time: '2 weeks',
                    position: 1,
                    completed: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    resources: [
                        {
                            id: 'resource-1',
                            milestone_id: 'milestone-1',
                            title: 'Python for Beginners',
                            type: 'Course',
                            platform: 'Coursera',
                            url: 'https://coursera.org/python',
                            image_url: 'https://example.com/python.jpg',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        },
                    ],
                },
                {
                    id: 'milestone-2',
                    phase_id: 'phase-1',
                    title: 'NumPy & Pandas',
                    description: 'Learn data manipulation',
                    estimated_time: '1 week',
                    position: 2,
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    resources: [],
                },
            ],
        },
    ],
};

// Create a chainable mock for Supabase query builder
function createQueryBuilder<T>(data: T | null, error: Error | null = null) {
    const builder = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data, error }),
        maybeSingle: vi.fn().mockResolvedValue({ data, error }),
        then: vi.fn((resolve) => resolve({ data, error })),
    };
    return builder;
}

// Mock Supabase client
export const createMockSupabaseClient = () => ({
    auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null }),
        signUp: vi.fn().mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        }),
    },
    from: vi.fn((table: string) => {
        switch (table) {
            case 'profiles':
                return createQueryBuilder(mockProfileOldFormat);
            case 'roadmaps':
                return createQueryBuilder(mockRoadmap);
            default:
                return createQueryBuilder(null);
        }
    }),
    functions: {
        invoke: vi.fn().mockResolvedValue({ data: { roadmapId: 'new-roadmap-id' }, error: null }),
    },
    rpc: vi.fn().mockResolvedValue({ data: 'new-roadmap-id', error: null }),
});

// Default mock instance
export const mockSupabase = createMockSupabaseClient();
