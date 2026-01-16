'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import type { ErrorDisplayProps } from '@/types';

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-xl shadow-lg p-6 max-w-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Error
          </h3>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
