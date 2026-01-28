/*
export interface ConversationUser {
  id: string;
  email: string | null;
  pseudo?: string | null;
  firstname?: string | null;
  lastname?: string | null;
}

export interface Conversation {
  conversationId: string;
  otherUser: ConversationUser;
}
*/

import type { Profile } from "./profile";

export interface Conversation {
  conversationId: string;
  name: string | null;
  otherUser: Profile | null;
  createdAt: string;
  participants: Profile[];
  userToUser: boolean;
}
