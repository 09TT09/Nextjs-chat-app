import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/* Get conversation ids for the authenticated user */
type ConversationParticipant = {
  conversation_id: string;
};

export async function getUserConversationIds(userId: string): Promise<ConversationParticipant[]> {
  if (!userId) throw new Error("L'identifiant de l'utilisateur est requis");

  const { data } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId)
    .throwOnError();
  
  return data ?? [];
}

/* Get multiple conversations by IDs */
export async function getConversationsByIds(userId: string) {
  if (!userId) return [];

  const { data: participantConversations } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  if (!participantConversations?.length) return [];

  const conversationIds = participantConversations.map(pc => pc.conversation_id);

  const { data: conversationsData } = await supabase
    .from("conversations")
    .select(`
      id,
      name,
      created_at,
      conversation_participants (
        user_id,
        profiles!conversation_participants_user_id_fkey (
          id,
          pseudo,
          email,
          picture
        )
      )
    `)
    .in("id", conversationIds);

  return conversationsData.map((conversation: any) => {
    const participants = conversation.conversation_participants.map((p: any) => p.profiles);
    return {
      conversationId: conversation.id,
      name: conversation.name,
      createdAt: conversation.created_at,
      participants,
      otherUser: participants.find(p => p.id !== userId) ?? null,
    };
  });
}


/* Create a user to user conversation */
export async function createUserToUserConversation(otherUserId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("create_user_to_user_conversation", { other_user: otherUserId })
    .single();

  if (error) throw error;

  return data.conversation_id as string;
}
