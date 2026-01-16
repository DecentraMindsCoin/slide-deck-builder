/**
 * Safely retrieves environment variables with validation
 * @param key - The environment variable key
 * @param fallback - Optional fallback value if the variable is not set
 * @returns The environment variable value
 * @throws Error if the variable is not set and no fallback is provided
 */
export const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(
      `Missing environment variable: ${key}. Please check your .env.local file.`
    );
  }
  return value;
};

/**
 * Checks if we're running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Checks if we're running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Checks if we're running in test mode
 */
export const isTest = process.env.NODE_ENV === 'test';
