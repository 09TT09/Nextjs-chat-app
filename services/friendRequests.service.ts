import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/* Create a new friend request */
export async function createFriendRequest( senderId: string, receiverId: string
): Promise< { status: "valid", id: string } | { status: "error", message: string } > {
  const { data, error } = await supabase
    .from("friend_requests")
    .insert({ sender_id: senderId, receiver_id: receiverId })
    .select("id")
    .single();

  if(error) return { status: "error", message: error.message ?? "Une erreur est survenue lors de la création de la requête de demande en ami." }
  
  return { status: "valid", id: data.id };
}
