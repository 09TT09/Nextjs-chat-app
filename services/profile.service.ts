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
