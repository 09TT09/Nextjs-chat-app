import { create } from "zustand";
import type { Profile } from "@/types/profile";

interface FriendStore {
  friends: Profile[];
  friendsLoading: boolean;
  setFriends: (friends: Profile[]) => void;
  addFriend: (friend: Profile) => void;
  setFriendsLoading: (value: boolean) => void;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friends: [],
  friendsLoading: true,
  setFriends: (friends) => set({ friends }),
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend], })),
  setFriendsLoading: (value) => set({ friendsLoading: value }),
}));
