import type { Profile } from "./profile";

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
}
