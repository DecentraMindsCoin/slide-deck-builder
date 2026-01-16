
/**
 * API Service Layer
 * 
 * Handles business logic for external API calls including:
 * - Request orchestration and validation
 * - Error handling and transformation
 * - Response normalization
 * 
 * Uses utilities from /lib for reusable HTTP helpers
 */

import type { ApiResponse, ApiError } from "@/types";
import { createAbortController, DEFAULT_REQUEST_TIMEOUT } from "@/lib/utils/index";

/**
 * Generates slides from a prompt using the AI API
 * @param prompt - The user's prompt for slide generation
 * @param model - The AI model to use (default: gpt-4o-2024-08-06)
 * @returns Promise with the generated slide deck
 * @throws Error if the request fails or times out
 */
export async function generateSlides(
  prompt: string,
  model: string = "gpt-4o-2024-08-06"
): Promise<ApiResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  if (!API_URL || !API_KEY) {
    throw new Error(
      "API configuration is missing. Please check your .env.local file."
    );
  }

  const { controller, timeoutId } = createAbortController(
    DEFAULT_REQUEST_TIMEOUT
  );

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
      signal: controller.signal,
      // Next.js specific: disable caching for POST requests
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        success: false,
        error: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse = await response.json();

    // Validate response structure
    if (!data.success || !data.data) {
      throw new Error("Invalid response format from API");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout - the server took too long to respond"
        );
      }
      throw error;
    }

    throw new Error("An unexpected error occurred while generating slides");
  }
}
