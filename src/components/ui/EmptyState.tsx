import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  message: string;
}

export default function EmptyState({ icon: Icon, heading, message }: EmptyStateProps) {
  return (
    <div className="p-4 flex items-center justify-center h-full">
      <div className="max-w-sm mx-auto">
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 bg-zinc-800/30">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-700/50 flex items-center justify-center">
              <Icon className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-1">{heading}</h3>
              <p className="text-xs text-zinc-500">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
