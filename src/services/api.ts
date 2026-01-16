import type { ApiResponse, ApiError } from '@/types';
import { getEnvVar } from '@/lib';

const API_URL = getEnvVar('NEXT_PUBLIC_API_URL');
const API_KEY = getEnvVar('NEXT_PUBLIC_API_KEY');

export async function generateSlides(
  prompt: string,
  model: string = 'gpt-4o-2024-08-06'
): Promise<ApiResponse> {

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      prompt,
      model,
    }),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      success: false,
      error: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  return data;
}
