import { create } from 'zustand';

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: string[];
  originalIds: string[];
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  addToQueue: (id: string) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
}

const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isShuffled: false,
  repeatMode: 'off',
  queue: [],
  originalIds: [],

  setId: (id: string) => set({ activeId: id }),
  
  setIds: (ids: string[]) => set({ 
    ids,
    originalIds: ids 
  }),

  reset: () => set({ 
    ids: [], 
    activeId: undefined,
    queue: [],
    originalIds: []
  }),

  toggleShuffle: () => {
    const { isShuffled, ids, originalIds } = get();
    
    if (!isShuffled) {
      // Shuffle the array
      const shuffled = [...ids];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      set({ ids: shuffled, isShuffled: true });
    } else {
      // Restore original order
      set({ ids: originalIds, isShuffled: false });
    }
  },

  setRepeatMode: (mode: 'off' | 'all' | 'one') => set({ repeatMode: mode }),

  addToQueue: (id: string) => {
    const { queue } = get();
    if (!queue.includes(id)) {
      set({ queue: [...queue, id] });
    }
  },

  removeFromQueue: (id: string) => {
    const { queue } = get();
    set({ queue: queue.filter(qId => qId !== id) });
  },

  clearQueue: () => set({ queue: [] })
}));

export default usePlayer;
