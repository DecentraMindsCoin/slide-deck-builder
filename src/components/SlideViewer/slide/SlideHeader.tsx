interface SlideHeaderProps {
  deckTitle: string;
}

export default function SlideHeader({ deckTitle }: SlideHeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 shrink-0">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">{deckTitle}</h1>
      </div>
    </header>
  );
}
