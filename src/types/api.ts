import type { SlideDeck } from './slides';

export interface ApiResponse {
  success: boolean;
  data: SlideDeck;
}

export interface ApiError {
  success: false;
  error: string;
}

export interface GenerateSlidesRequest {
  prompt: string;
  model?: string;
}

export interface ApiConfig {
  url: string;
  apiKey: string;
  timeout?: number;
}