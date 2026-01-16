import { create } from 'zustand';

interface UIState {
  isHistoryPanelOpen: boolean;
  toggleHistoryPanel: () => void;
  setHistoryPanelOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isHistoryPanelOpen: false,
  toggleHistoryPanel: () =>
    set((state) => ({ isHistoryPanelOpen: !state.isHistoryPanelOpen })),
  setHistoryPanelOpen: (isOpen) => set({ isHistoryPanelOpen: isOpen }),
}));
