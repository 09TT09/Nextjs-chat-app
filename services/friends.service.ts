import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/* Get all friend requests where the authenticated user is sender or receiver */
export async function getFriendRequests(userId: string) {
  const { data, error } = await supabase
    .from("friend_requests")
    .select(`
      *,
      sender:profiles!friend_requests_sender_id_fkey (*),
      receiver:profiles!friend_requests_receiver_id_fkey (*)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/* Send a friend request to an user with it friendcode */
export async function sendFriendRequestByCode(senderId: string, code: string) {
  const { data: receiver, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("friendcode", code)
    .single();

  if (error) throw error;
  if (!receiver) throw new Error("User not found");

  return supabase
    .from("friend_requests")
    .insert({ sender_id: senderId, receiver_id: receiver.id });
}

/* Accept or reject a friend request */
export async function respondToFriendRequest(id: number, accepted: boolean) {
  return supabase
    .from("friend_requests")
    .update({ status: accepted ? "accepted" : "rejected" })
    .eq("id", id);
}

/* Get all the friends profiles */
export async function getFriendsProfiles(userId: string) {
  const { data, error } = await supabase
    .from("friends")
    .select('friend:profiles!friends_friend_id_fkey(*)')
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.friend);
}