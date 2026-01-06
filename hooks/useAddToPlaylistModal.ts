import { create } from 'zustand';

interface AddToPlaylistModalStore {
  isOpen: boolean;
  songId: string | null;
  onOpen: (songId: string) => void;
  onClose: () => void;
}

const useAddToPlaylistModal = create<AddToPlaylistModalStore>((set) => ({
  isOpen: false,
  songId: null,
  onOpen: (songId: string) => set({ isOpen: true, songId }),
  onClose: () => set({ isOpen: false, songId: null }),
}));

export default useAddToPlaylistModal;
