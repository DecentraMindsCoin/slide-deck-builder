'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Eye } from 'lucide-react';
import Confetti from 'react-confetti';
import Button from '@/components/ui/Button';

interface GeneratedSuccessProps {
  onView: () => void;
  slideCount: number;
}

export default function GeneratedSuccess({ onView, slideCount }: GeneratedSuccessProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Update window size on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>

          {/* Message */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Slide Deck Generated!
            </h2>
            <p className="text-zinc-400">
              Your presentation with {slideCount} {slideCount === 1 ? 'slide' : 'slides'} is ready to view
            </p>
          </div>

          {/* View Button */}
          <Button
            onClick={onView}
            variant="primary"
            icon={<Eye className="w-5 h-5" />}
            size="lg"
            fullWidth
          >
            View Slide Deck
          </Button>
        </div>
      </div>
    </div>
  );
}
