import { useEffect } from "react";
import { getFriendsProfiles } from "@/services/friends.service";
import { useFriendStore } from "@/stores/friend.store";

export function useFriends(userId: string | null) {
  const store = useFriendStore();
  const { setFriends, setFriendsLoading } = useFriendStore();

  /* Get all the friends of an authenticated user */
  useEffect(() => {
    if (!userId) return;
    
    async function fetchFriends() {
      const data = await getFriendsProfiles(userId!);
      setFriends(data);
      setFriendsLoading(false);
    }

    fetchFriends();
  }, [userId, setFriends, setFriendsLoading]);

  return store;
}
