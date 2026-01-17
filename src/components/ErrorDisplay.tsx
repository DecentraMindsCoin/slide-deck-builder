'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-xl shadow-lg p-6 max-w-md">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Error
          </h3>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <Button
            onClick={onRetry}
            variant="danger"
            fullWidth
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
