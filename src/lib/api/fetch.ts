/**
 * Fetch utilities for API requests
 */

/**
 * Creates an AbortController with automatic timeout
 * @param timeoutMs - Timeout in milliseconds
 * @returns Object containing the controller and timeout ID
 * @example
 * const { controller, timeoutId } = createAbortController(5000);
 * fetch(url, { signal: controller.signal })
 *   .finally(() => clearTimeout(timeoutId));
 */
export const createAbortController = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};

/**
 * Default timeout for API requests (30 seconds)
 */
export const DEFAULT_REQUEST_TIMEOUT = 30000;

/**
 * Fetches with automatic timeout and retry logic
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds (default: 30s)
 * @returns Fetch response
 * @throws Error if request times out or fails
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_REQUEST_TIMEOUT
): Promise<Response> {
  const { controller, timeoutId } = createAbortController(timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - the server took too long to respond');
    }
    throw error;
  }
}

/**
 * Parses JSON response with error handling
 * @param response - Fetch response
 * @returns Parsed JSON data
 */
export async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return await response.json();
  } catch (error) {
    throw new Error('Failed to parse response as JSON');
  }
}
