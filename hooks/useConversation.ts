import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback, useRef } from "react";
import { getUserConversationIds, getConversationsByIds, /*createOrFindConversation,*/ openOrCreateUserConversation } from "@/services/conversations.service";
import type { Conversation } from "@/types/conversation";

export function useConversations(userId: string | null) {
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsloading, setConversationsLoading] = useState(true);
  const mounted = useRef(true);

  /* Prevent state updates after unmount */
  useEffect(() => { return () => { mounted.current = false; }; }, []);

  /* Load the conversations for authenticated user */
  const loadConversations = useCallback(async (signal?: AbortSignal) => {
    if (!userId || signal?.aborted) return;

    setConversationsLoading(true);

    try {
      const participantConversations = await getUserConversationIds(userId);
      if (signal?.aborted) return;
      if (participantConversations.length === 0) {
        setConversations([]);
        return;
      }
      const conversationsIds = participantConversations.map(participant => participant.conversation_id);
      const conversationsRows = await getConversationsByIds(userId);
      if (signal?.aborted) return;

      const formatted: Conversation[] = conversationsRows.map(conversation => ({
        conversationId: conversation.conversationId,
        name: conversation.name,
        createdAt: conversation.createdAt,
        participants: conversation.participants,
        otherUser: conversation.otherUser,
      }));

      setConversations(formatted);
    }
    finally {
      if (!signal?.aborted) setConversationsLoading(false);
    }
  }, [userId]);

  /* Auto-load conversations when userId changes */
  useEffect(() => { if (userId) loadConversations(); }, [userId, loadConversations]);

  /* Create or open a user to user conversation */
  const createOrOpenConversation = useCallback(
    async (otherUserId: string): Promise<string> => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const conversationId = await openOrCreateUserConversation(userId, otherUserId);
        await loadConversations();
        return conversationId;
      } catch (error) {
        console.error("Failed to create/open conversation:", error);
        throw error;
      }
    },
    [userId, loadConversations]
  );

  /* Refresh conversations if the user is added to a new conversation */
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user:${userId}:conversations`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_participants",
        },
        async (payload) => {
          if (payload.new.user_id === userId) {
            await loadConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadConversations]);


  /* Helper for UI: open a conversation with one user */
  async function onMessage(otherUserId: string): Promise<string | null> {
    if (!userId) return null;

    try {
      const conversationId = await openOrCreateUserConversation(userId, otherUserId);
      await loadConversations(); // refresh the list
      return conversationId;
    } catch (error) {
      console.error("Failed to create/open conversation:", error);
      return null;
    }
  }

  return {
    conversations,
    conversationsloading,
    reload: loadConversations,
    createOrOpenConversation,
    onMessage
  };
}
