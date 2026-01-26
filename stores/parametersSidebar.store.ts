import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export const useParametersSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  setIsOpen: (state) => set({ isOpen: state }),
}));
