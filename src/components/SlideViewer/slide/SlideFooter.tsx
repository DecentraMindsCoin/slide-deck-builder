"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface SlideFooterProps {
  currentIndex: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function SlideFooter({
  currentIndex,
  totalSlides,
  onPrevious,
  onNext,
}: SlideFooterProps) {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 px-6 py-4 shrink-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          variant="secondary"
          size="lg"
          icon={<ChevronLeft className="w-5 h-5" />}
          className="rounded-xl"
        >
          Previous
        </Button>

        <div className="flex flex-col items-center gap-1">
          <div className="text-white text-lg font-semibold">
            {currentIndex + 1} of {totalSlides}
          </div>
          <div className="text-zinc-400 text-xs">
            Use arrow keys to navigate
          </div>
        </div>

        <Button
          onClick={onNext}
          disabled={currentIndex === totalSlides - 1}
          variant="secondary"
          size="lg"
          icon={<ChevronRight className="w-5 h-5" />}
          className="rounded-xl flex-row-reverse"
        >
          Next
        </Button>
      </div>
    </footer>
  );
}
