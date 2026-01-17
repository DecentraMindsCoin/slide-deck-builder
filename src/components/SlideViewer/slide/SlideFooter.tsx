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
    <footer className="absolute bottom-0 w-full bg-zinc-900/20 backdrop-blur-lg rounded-b-2xl border-t border-zinc-800 px-6 py-3 shrink-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          variant="secondary"
          size="sm"
          icon={<ChevronLeft className="w-4 h-4" />}
          className="rounded-xl"
        >
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={currentIndex === totalSlides - 1}
          variant="secondary"
          size="sm"
          icon={<ChevronRight className="w-4 h-4" />}
          className="rounded-xl flex-row-reverse"
        >
          Next
        </Button>
      </div>
    </footer>
  );
}
