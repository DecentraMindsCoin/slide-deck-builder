'use client';

import { Plus, Sparkles, History, Settings, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSlideDeckStore } from "@/store/useSlideDeckStore";
import { useUIStore } from "@/store/useUIStore";
// import { NAV_BUTTONS } from "@/constants/navigation";

interface SidebarProps {
  onFocusPrompt?: () => void;
}

export default function Sidebar({ onFocusPrompt }: SidebarProps) {
  const history = useSlideDeckStore((state) => state.history);
  const appState = useSlideDeckStore((state) => state.appState);
  const reset = useSlideDeckStore((state) => state.reset);
  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);

  const handleNewDeck = () => {
    reset();
    onFocusPrompt?.();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 space-y-2 z-100">
      {/* Logo */}
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-black" />
      </div>

      {/* New Deck Button */}
      <Button
        onClick={handleNewDeck}
        variant="secondary"
        icon={<Plus className="w-5 h-5" />}
        className="group relative"
        title="New Deck"
      >
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          New
        </span>
      </Button>


      {/* Navigation Icons */}
      <Button
        onClick={() => togglePanel('history')}
        variant="icon"
        icon={<History className="w-5 h-5" />}
        className={`group relative ${
          activePanel === 'history' ? 'bg-zinc-800 text-white' : ''
        }`}
        title="History"
      >
        {history.length > 0 && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white/50 rounded-full flex items-center justify-center text-[10px] text-black font-semibold">
            {history.length}
          </span>
        )}
        <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          History
        </span>
      </Button>

      {/* Viewer Panel Toggle - Only visible when viewing slides */}
      {appState === "viewing" && (
        <Button
          onClick={() => togglePanel("viewer")}
          variant="icon"
          icon={<Eye className="w-5 h-5" />}
          className={`group relative ${
            activePanel === "viewer" ? "bg-zinc-800 text-white" : ""
          }`}
          title="Viewer"
        >
          <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Viewer
          </span>
        </Button>
      )}

      {/* Editor Panel Toggle - Only visible when viewing slides */}
      {appState === "viewing" && (
        <Button
          onClick={() => togglePanel("editor")}
          variant="icon"
          icon={<Settings className="w-5 h-5" />}
          className={`group relative ${
            activePanel === "editor" ? "bg-zinc-800 text-white" : ""
          }`}
          title="Editor"
        >
          <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Editor
          </span>
        </Button>
      )}

      {/* Navigation Buttons (Disabled for now) */}
      {/* {NAV_BUTTONS.map(({ icon: Icon, title }) => (
        <Button
          key={title}
          variant="icon"
          icon={<Icon className="w-5 h-5" />}
          className="group relative"
          title={title}
        >
          <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {title}
          </span>
        </Button>
      ))} */}

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
}
