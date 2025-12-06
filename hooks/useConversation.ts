"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getUserConversationIds, getConversationsByIds, createOrFindConversation } from "@/services/conversations.service";
import type { Conversation } from "@/types/conversation";

export function useConversations(userId: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  /* Prevent state updates after unmount */
  const mounted = useRef(true);
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  /* Load the conversations for user authenticated */
  const loadConversations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const { data: participantRows, error } = await getUserConversationIds(userId);
      if (error) throw error;

      if (!participantRows?.length) {
        if (mounted.current) setConversations([]);
        return;
      }

      const ids = participantRows.map((p) => p.conversation_id);

      const { data: convRows, error: convError } = await getConversationsByIds(ids);
      if (convError) throw convError;

      const formatted: Conversation[] = convRows.map((c) => {
        const participants = c.conversation_participants.map((p) => p.profiles);
        return {
          conversationId: c.id,
          name: c.name,
          createdAt: c.created_at,
          participants,
          otherUser: participants.find((p) => p.id !== userId) ?? null
        };
      });

      if (mounted.current) setConversations(formatted);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [userId]);

  /* Auto-load when user changes */
  useEffect(() => {
    if (userId) loadConversations();
  }, [userId, loadConversations]);

  /* CREATE or OPEN a 1–1 conversation */
  const createOrOpenConversation = useCallback(
    async (userA: string, userB: string): Promise<string> => {
      const { data, error } = await createOrFindConversation(userA, userB);

      if (error) throw error;
      if (!data?.id) throw new Error("Conversation ID missing from response.");

      await loadConversations();
      return data.id;
    },
    [loadConversations]
  );

  /* Helper for UI: open a conversation with one user */
  async function onMessage(otherUserId: string): Promise<string | null> {
    if (!userId) return null;
    return await createOrOpenConversation(userId, otherUserId);
  }

  return {
    conversations,
    loading,
    reload: loadConversations,
    createOrOpenConversation,
    onMessage
  };
}
