import type { Profile } from "./profile";

export interface FriendRequest {
  id: number;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  sender: Profile;
  receiver: Profile;
}
