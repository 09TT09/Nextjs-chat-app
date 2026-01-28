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
      user_to_user,
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
      userToUser: conversation.user_to_user,
      participants,
      otherUser: participants.find(p => p.id !== userId) ?? null,
    };
  });
}


/* Create a user to user conversation */
export async function openOrCreateUserConversation(userId: string, otherUserId: string): Promise<string> {

  // Order user IDs
  const user1 = userId < otherUserId ? userId : otherUserId
  const user2 = userId < otherUserId ? otherUserId : userId

  // Try to insert (safe because of unique index)
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_to_user: true,
      user1_id: user1,
      user2_id: user2,
      created_by: userId,
    })
    .select("id")
    .single()

  // If insert succeeded, create the 2 participantsa and return new conversation
  if (!error && data) {
    await supabase
      .from("conversation_participants")
      .insert({
        user_id: userId,
        conversation_id: data.id,
      })

    await supabase
      .from("conversation_participants")
      .insert({
        user_id: otherUserId,
        conversation_id: data.id,
      })
    
    return data.id
  }

  // If conflict, fetch existing conversation
  const { data: existing, error: fetchError } = await supabase
    .from("conversations")
    .select("id")
    .match({
      user_to_user: true,
      user1_id: user1,
      user2_id: user2,
    })
    .single()

  if (fetchError || !existing) {
    throw fetchError ?? new Error("Failed to fetch conversation")
  }

  return existing.id
}