/**
 * Structured Logging Utility
 * 
 * Provides consistent, structured logging across the application.
 * In development, logs to console. In production, can be extended
 * to send to external logging services (e.g., Sentry, Datadog).
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
    /** Operation or function name */
    operation?: string;
    /** User ID if available */
    userId?: string;
    /** Request/transaction ID for tracing */
    requestId?: string;
    /** Additional contextual data */
    [key: string]: unknown;
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

/**
 * Determines if we're in development mode.
 */
const isDev = typeof process !== 'undefined'
    ? process.env.NODE_ENV === 'development'
    : true; // Default to dev in browser

/**
 * Formats a log entry for console output.
 */
function formatForConsole(entry: LogEntry): string {
    const parts = [
        `[${entry.level.toUpperCase()}]`,
        entry.timestamp,
        entry.context?.operation ? `[${entry.context.operation}]` : '',
        entry.message,
    ].filter(Boolean);

    return parts.join(' ');
}

/**
 * Structured logger instance.
 */
class Logger {
    private context: LogContext = {};

    /**
     * Creates a child logger with additional context.
     */
    child(context: LogContext): Logger {
        const child = new Logger();
        child.context = { ...this.context, ...context };
        return child;
    }

    /**
     * Logs a debug message (only in development).
     */
    debug(message: string, context?: LogContext): void {
        if (!isDev) return;
        this.log('debug', message, context);
    }

    /**
     * Logs an info message.
     */
    info(message: string, context?: LogContext): void {
        this.log('info', message, context);
    }

    /**
     * Logs a warning message.
     */
    warn(message: string, context?: LogContext): void {
        this.log('warn', message, context);
    }

    /**
     * Logs an error with optional error object.
     */
    error(message: string, error?: unknown, context?: LogContext): void {
        const errorInfo = this.extractErrorInfo(error);
        this.log('error', message, context, errorInfo);
    }

    /**
     * Core logging function.
     */
    private log(
        level: LogLevel,
        message: string,
        context?: LogContext,
        error?: LogEntry['error']
    ): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context: { ...this.context, ...context },
            error,
        };

        // In development, log to console
        if (isDev) {
            const formatted = formatForConsole(entry);

            switch (level) {
                case 'debug':
                    console.debug(formatted, entry.context);
                    break;
                case 'info':
                    console.info(formatted, entry.context);
                    break;
                case 'warn':
                    console.warn(formatted, entry.context);
                    break;
                case 'error':
                    console.error(formatted, entry.error, entry.context);
                    break;
            }
        }

        // TODO: In production, send to external logging service
        // Example: Sentry, Datadog, LogRocket, etc.
        // if (!isDev && level === 'error') {
        //   sendToExternalService(entry);
        // }
    }

    /**
     * Extracts error information from various error types.
     */
    private extractErrorInfo(error: unknown): LogEntry['error'] | undefined {
        if (!error) return undefined;

        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        }

        if (typeof error === 'string') {
            return {
                name: 'Error',
                message: error,
            };
        }

        if (typeof error === 'object') {
            const errorObj = error as Record<string, unknown>;
            return {
                name: (errorObj.name as string) || 'Error',
                message: (errorObj.message as string) || JSON.stringify(error),
            };
        }

        return {
            name: 'Error',
            message: String(error),
        };
    }
}

/**
 * Default logger instance for application-wide use.
 */
export const logger = new Logger();

/**
 * Creates a logger with specific context for a component or feature.
 * 
 * @example
 * const log = createLogger({ operation: 'AuthContext' });
 * log.info('User signed in', { userId: user.id });
 * log.error('Sign in failed', error, { provider: 'google' });
 */
export function createLogger(context: LogContext): Logger {
    return logger.child(context);
}
