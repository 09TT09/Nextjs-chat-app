import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/* Get all unread notifications for an user */
export async function getUnreadNotificationsForUser(userId: string): Promise<{ type: string, sender_id: string | null, created_at: string}[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("type, sender_id, created_at")
    .eq("recipient_id", userId)
    .is("read_at", null)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Failed to get notifications for the user");
  }

  return data;
}

/* Create a notification */
export async function createNotification(
    type: string,
    recipient_id: string,
    sender_id: string | null,
    entity_type: string,
    entity_id: string
  ): Promise<string> {

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      type: type,
      recipient_id: recipient_id,
      sender_id: sender_id,
      entity_type: entity_type,
      entity_id: entity_id
    })
    .select("id")
    .single();

  if (error) {
    throw new Error("Failed to create notification");
  }

  if (!data || !data.id) {
    throw new Error("Notification created but no ID returned.");
  }

  return data.id;
}