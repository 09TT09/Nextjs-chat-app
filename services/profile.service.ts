import { createClient } from "@/utils/supabase/client";
import type { Profile } from "@/types/profile";

const supabase = createClient();

/* Get the profile with the user id */
export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Profile not found");
  }

  return data;
}

/* Get the profile Id with the friend code */
export async function getProfileWithFriendCode( currentUserId: string, friendCode: string
): Promise< { status: "valid", id: string } | { status: "error", message: string } > {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("friendcode", friendCode)
    .single();

  if (error || !data) return { status: "error", message: "Aucun utilisateur trouvé avec ce code." }
  if (data.id === currentUserId) return { status: "error", message: "Vous ne pouvez pas vous ajouter vous-même." }
  
  return { status: "valid", id: data.id };
}

/* Update the profile with the user id and the fields to update */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "pseudo" | "firstname" | "lastname">>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Could not update profile");
  }

  return data;
}
