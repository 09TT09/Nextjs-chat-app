import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/* Get conversation ids for the authenticated user */
export async function getUserConversationIds(userId: string) {
  return await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);
}

/* Get multiple conversations by IDs */
export async function getConversationsByIds(ids: number[]) {
  return await supabase
    .from("conversations")
    .select(`
      id,
      name,
      created_at,
      conversation_participants (
        user_id,
        profiles (
          id,
          pseudo,
          email,
          picture,
          friendcode
        )
      )
    `)
    .in("id", ids)
    .order("created_at", { ascending: false });
}

/* Find the correct conversation or create a new one if the conversation does not exist */
export async function createOrFindConversation(userA: string, userB: string) {
  const supabase = createClient();

  // 1. Check existing 1–1 conversation
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("id, user_to_user, conversation_participants (*)")
    .eq("user_to_user", true);

  if (findError) return { data: null, error: findError };

  const existingConv = existing?.find((conv) => {
    const participantIds = conv.conversation_participants.map((p) => p.user_id);
    return (
      participantIds.includes(userA) &&
      participantIds.includes(userB)
    );
  });

  if (existingConv) {
    return { data: { id: existingConv.id }, error: null };
  }

  // 2. Create conversation
  const { data: newConv, error: createError } = await supabase
    .from("conversations")
    .insert({ user_to_user: true })
    .select("id")
    .single();

  if (createError || !newConv) {
    return { data: null, error: createError ?? new Error("Conversation creation failed") };
  }

  const newId = newConv.id;

  // 3. Add participants
  const { error: partError } = await supabase
    .from("conversation_participants")
    .insert([
      { conversation_id: newId, user_id: userA },
      { conversation_id: newId, user_id: userB }
    ]);

  if (partError) {
    return { data: { id: newId }, error: partError };
  }

  return { data: { id: newId }, error: null };
}


