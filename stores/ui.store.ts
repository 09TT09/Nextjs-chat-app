import { create } from "zustand";

interface UIState {
  friendWindow: boolean;
  setFriendWindow: (state: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  friendWindow: false,
  setFriendWindow: (state) => set({ friendWindow: state }),
}));
