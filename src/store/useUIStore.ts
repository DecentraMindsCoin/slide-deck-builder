import { create } from 'zustand';

export type PanelType = 'history' | 'editor' | null;

interface UIState {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  togglePanel: (panel: Exclude<PanelType, null>) => void;
  // Legacy getters for backward compatibility
  isHistoryPanelOpen: boolean;
  isEditorPanelOpen: boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  activePanel: null,
  
  setActivePanel: (panel) => set({ activePanel: panel }),
  
  togglePanel: (panel) =>
    set((state) => ({
      activePanel: state.activePanel === panel ? null : panel,
    })),
  
  // Legacy getters for backward compatibility
  get isHistoryPanelOpen() {
    return get().activePanel === 'history';
  },
  
  get isEditorPanelOpen() {
    return get().activePanel === 'editor';
  },
}));

// Legacy helper functions for backward compatibility
export const toggleHistoryPanel = () => useUIStore.getState().togglePanel('history');
export const toggleEditorPanel = () => useUIStore.getState().togglePanel('editor');
export const setHistoryPanelOpen = (isOpen: boolean) => 
  useUIStore.getState().setActivePanel(isOpen ? 'history' : null);
export const setEditorPanelOpen = (isOpen: boolean) => 
  useUIStore.getState().setActivePanel(isOpen ? 'editor' : null);
