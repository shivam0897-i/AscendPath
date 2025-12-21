/**
 * Retry Utilities for AI/LLM Operations
 * 
 * Provides robust retry logic for operations that may fail transiently,
 * such as JSON parsing from LLM responses or network requests.
 */

export interface RetryOptions {
    /** Maximum number of retry attempts (default: 3) */
    maxAttempts?: number;
    /** Delay between retries in milliseconds (default: 1000) */
    delayMs?: number;
    /** Multiplier for exponential backoff (default: 2) */
    backoffMultiplier?: number;
    /** Function to determine if error is retryable (default: all errors) */
    isRetryable?: (error: unknown) => boolean;
    /** Callback for each retry attempt */
    onRetry?: (attempt: number, error: unknown) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> = {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
    isRetryable: () => true,
};

/**
 * Executes an async operation with retry logic.
 * Uses exponential backoff between attempts.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError: unknown;
    let currentDelay = opts.delayMs;

    for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            // Check if error is retryable
            if (!opts.isRetryable(error)) {
                throw error;
            }

            // Don't delay after the last attempt
            if (attempt < opts.maxAttempts) {
                opts.onRetry?.(attempt, error);
                await sleep(currentDelay);
                currentDelay *= opts.backoffMultiplier;
            }
        }
    }

    throw lastError;
}

/**
 * Attempts to parse JSON with retry logic.
 * Useful for LLM responses that may be truncated or malformed.
 */
export async function parseJSONWithRetry<T>(
    getText: () => Promise<string>,
    options: RetryOptions = {}
): Promise<T> {
    return withRetry(async () => {
        const text = await getText();
        return parseJSON<T>(text);
    }, {
        ...options,
        isRetryable: (error) => {
            // Retry on JSON parse errors (truncation, malformed)
            if (error instanceof SyntaxError) return true;
            // Retry on custom parse errors
            if (error instanceof JSONParseError) return true;
            // Use custom isRetryable if provided
            return options.isRetryable?.(error) ?? false;
        },
    });
}

/**
 * Custom error for JSON parsing failures with context.
 */
export class JSONParseError extends Error {
    constructor(
        message: string,
        public readonly rawText: string,
        public readonly originalError?: Error
    ) {
        super(message);
        this.name = 'JSONParseError';
    }
}

/**
 * Attempts to parse JSON, with recovery for common LLM output issues.
 */
export function parseJSON<T>(text: string): T {
    if (!text || typeof text !== 'string') {
        throw new JSONParseError('Empty or invalid input', text || '');
    }

    // Trim whitespace
    let cleaned = text.trim();

    // Remove markdown code blocks if present
    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        cleaned = codeBlockMatch[1].trim();
    }

    // Try to find JSON object or array boundaries
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
        cleaned = jsonMatch[1];
    }

    // Attempt to repair truncated JSON (common with LLM output limits)
    cleaned = attemptJSONRepair(cleaned);

    try {
        return JSON.parse(cleaned) as T;
    } catch (error) {
        throw new JSONParseError(
            `Failed to parse JSON: ${(error as Error).message}`,
            text,
            error as Error
        );
    }
}

/**
 * Attempts basic repairs on potentially truncated JSON.
 * This is a best-effort heuristic for LLM output.
 */
function attemptJSONRepair(text: string): string {
    let result = text;

    // Count brackets/braces
    const openBraces = (result.match(/\{/g) || []).length;
    const closeBraces = (result.match(/\}/g) || []).length;
    const openBrackets = (result.match(/\[/g) || []).length;
    const closeBrackets = (result.match(/\]/g) || []).length;

    // If truncated, try to close open structures
    if (openBraces > closeBraces) {
        // Remove trailing incomplete content after last complete value
        result = result.replace(/,\s*"[^"]*(?:"|$)\s*$/, '');
        result = result.replace(/,\s*$/, '');

        // Add missing closing braces
        result += '}'.repeat(openBraces - closeBraces);
    }

    if (openBrackets > closeBrackets) {
        result += ']'.repeat(openBrackets - closeBrackets);
    }

    return result;
}

/**
 * Sleep utility for delays.
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Supabase-specific error codes that are retryable.
 */
const RETRYABLE_SUPABASE_CODES = [
    'PGRST301', // Connection error
    '503',      // Service unavailable
    '502',      // Bad gateway
    '504',      // Gateway timeout
    '429',      // Rate limited
];

/**
 * Checks if a Supabase error is retryable (network/transient issues).
 */
function isSupabaseRetryable(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    
    const err = error as { code?: string; message?: string; status?: number };
    
    // Check for network errors
    if (err.message?.toLowerCase().includes('network')) return true;
    if (err.message?.toLowerCase().includes('fetch')) return true;
    if (err.message?.toLowerCase().includes('timeout')) return true;
    
    // Check for retryable Supabase/Postgres codes
    if (err.code && RETRYABLE_SUPABASE_CODES.includes(err.code)) return true;
    if (err.status && RETRYABLE_SUPABASE_CODES.includes(String(err.status))) return true;
    
    return false;
}

/**
 * Wraps a Supabase operation with retry logic for network errors.
 * Uses exponential backoff (1s, 2s, 4s).
 * 
 * @example
 * const { data, error } = await withSupabaseRetry(() => 
 *   supabase.from('profiles').select('*').eq('id', userId).single()
 * );
 */
export async function withSupabaseRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    return withRetry(operation, {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
        isRetryable: isSupabaseRetryable,
        ...options,
    });
}

