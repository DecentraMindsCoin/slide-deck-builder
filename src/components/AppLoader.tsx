'use client';

import { Sparkles } from 'lucide-react';

export default function AppLoader() {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-200">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl animate-pulse" />
          
          {/* Logo container */}
          <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center animate-in zoom-in duration-500">
            <Sparkles className="w-12 h-12 text-black animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-tight">
            Dunedain AI Slides
          </h2>
          <p className="text-zinc-400 text-sm animate-pulse">
            Configuring workspace...
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden animate-in fade-in duration-700 delay-500">
          <div 
            className="h-full bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full animate-loading-bar"
            style={{ width: '10%' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 10%;
          }
          50% {
            width: 60%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-loading-bar {
          width: 10%;
          animation: loading-bar 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
