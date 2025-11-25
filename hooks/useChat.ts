"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useChat() {
  const supabase = createClient();
  const router = useRouter();

  // Create or open a user-to-user conversation between two users
  async function createOrOpenConversation(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId) return;

    // Fetch all user-to-user conversations for the current user
    const { data: userConversations, error } = await supabase
      .from("conversation_participants")
      .select(`conversation_id, conversations!inner (id, user_to_user)`)
      .eq("user_id", currentUserId)
      .eq("conversations.user_to_user", true);

    if (error) {
      console.error(error);
      return;
    }

    let conversationId: string | null = null;

    // Find an existing user-to-user conversation with both users
    for (const conv of userConversations || []) {
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conv.conversation_id);

      const ids = participants?.map(p => p.user_id) || [];

      const isSamePair =
        ids.length === 2 &&
        ids.includes(currentUserId) &&
        ids.includes(otherUserId);

      if (isSamePair) {
        conversationId = conv.conversation_id;
        break;
      }
    }

    // If no conversation exists, create a new one
    if (!conversationId) {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({ created_by: currentUserId, user_to_user: true })
        .select("id")
        .single();

      if (convError) {
        console.error(convError);
        return;
      }

      conversationId = newConv.id;

      await supabase.from("conversation_participants").insert([
        { conversation_id: conversationId, user_id: currentUserId },
        { conversation_id: conversationId, user_id: otherUserId },
      ]);
    }

    router.push(`/chat/${conversationId}`);
  }

  return { createOrOpenConversation };
}
