/**
 * Input Sanitization Utilities for AI Prompts
 * 
 * Prevents prompt injection and ensures user inputs are safe
 * before being sent to the Gemini API.
 */
import { z } from 'zod';

/**
 * Maximum lengths for different input types
 */
const MAX_LENGTHS = {
    short: 100,    // Field names, labels
    medium: 500,   // Goals, descriptions
    long: 1000,    // Background, detailed text
} as const;

/**
 * Characters that could be used for prompt injection.
 * These are stripped from user inputs before being sent to AI.
 */
const DANGEROUS_PATTERNS = [
    // Markdown code blocks that might confuse parsing
    /```/g,
    // JSON-like structures that could corrupt output
    /[{}[\]]/g,
    // XML/HTML tags
    /<[^>]*>/g,
    // Escape sequences
    /\\[nrt]/g,
    // Multiple newlines (condense to single)
    /\n{3,}/g,
    // Control characters
    // eslint-disable-next-line no-control-regex
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,
];

/**
 * Sanitizes a string for safe inclusion in an AI prompt.
 * Removes potentially dangerous characters while preserving meaning.
 */
export function sanitizeForPrompt(input: string, maxLength: number = MAX_LENGTHS.medium): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    let sanitized = input;

    // Apply all dangerous pattern removals
    for (const pattern of DANGEROUS_PATTERNS) {
        sanitized = sanitized.replace(pattern, '');
    }

    // Normalize whitespace
    sanitized = sanitized
        .replace(/\s+/g, ' ')  // Collapse multiple spaces
        .trim();

    // Truncate to max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength).trim() + '...';
    }

    return sanitized;
}

/**
 * Sanitizes an array of strings for AI prompts.
 */
export function sanitizeArrayForPrompt(
    inputs: string[] | null | undefined,
    maxItemLength: number = MAX_LENGTHS.short
): string[] {
    if (!Array.isArray(inputs)) {
        return [];
    }

    return inputs
        .map(item => sanitizeForPrompt(item, maxItemLength))
        .filter(item => item.length > 0);
}

/**
 * Zod schema for validating profile data before AI prompt construction.
 * This ensures all required fields are present and within expected bounds.
 */
export const ProfileForAISchema = z.object({
    first_name: z.string().max(100).optional().nullable(),
    goals: z.array(z.string().max(500)).max(10).optional().nullable(),
    skills: z.array(z.string().max(200)).max(20).optional().nullable(),
    background: z.string().max(500).optional().nullable(),
    time_available: z.string().max(100).optional().nullable(),
    learning_style: z.string().max(200).optional().nullable(),
    challenges: z.union([
        z.array(z.string().max(300)),
        z.string().max(500),
    ]).optional().nullable(),
});

export type ProfileForAI = z.infer<typeof ProfileForAISchema>;

/**
 * Validates and sanitizes a profile object before using in AI prompt.
 * Returns a safe, sanitized version of the profile.
 */
export function sanitizeProfileForAI(profile: unknown): ProfileForAI {
    // Parse with Zod to validate structure
    const parsed = ProfileForAISchema.safeParse(profile);

    if (!parsed.success) {
        console.warn('Profile validation failed, using defaults:', parsed.error.issues);
        return {
            first_name: null,
            goals: null,
            skills: null,
            background: null,
            time_available: null,
            learning_style: null,
            challenges: null,
        };
    }

    const data = parsed.data;

    // Sanitize all string fields
    return {
        first_name: data.first_name ? sanitizeForPrompt(data.first_name, MAX_LENGTHS.short) : null,
        goals: data.goals ? sanitizeArrayForPrompt(data.goals, MAX_LENGTHS.medium) : null,
        skills: data.skills ? sanitizeArrayForPrompt(data.skills, MAX_LENGTHS.short) : null,
        background: data.background ? sanitizeForPrompt(data.background, MAX_LENGTHS.long) : null,
        time_available: data.time_available ? sanitizeForPrompt(data.time_available, MAX_LENGTHS.short) : null,
        learning_style: data.learning_style ? sanitizeForPrompt(data.learning_style, MAX_LENGTHS.short) : null,
        challenges: typeof data.challenges === 'string'
            ? sanitizeForPrompt(data.challenges, MAX_LENGTHS.medium)
            : Array.isArray(data.challenges)
                ? sanitizeArrayForPrompt(data.challenges, MAX_LENGTHS.medium)
                : null,
    };
}

/**
 * Formats sanitized profile data for inclusion in an AI prompt.
 * Returns a safe string representation.
 */
export function formatProfileForPrompt(profile: ProfileForAI): string {
    const lines: string[] = [];

    if (profile.first_name) {
        lines.push(`Name: ${profile.first_name}`);
    }

    if (profile.goals?.length) {
        lines.push(`Goals: ${profile.goals.join('; ')}`);
    }

    if (profile.skills?.length) {
        lines.push(`Skills: ${profile.skills.join('; ')}`);
    }

    if (profile.background) {
        lines.push(`Background: ${profile.background}`);
    }

    if (profile.time_available) {
        lines.push(`Time Available: ${profile.time_available}`);
    }

    if (profile.learning_style) {
        lines.push(`Learning Style: ${profile.learning_style}`);
    }

    if (profile.challenges) {
        const challengeStr = Array.isArray(profile.challenges)
            ? profile.challenges.join('; ')
            : profile.challenges;
        lines.push(`Challenges: ${challengeStr}`);
    }

    return lines.join('\n');
}
