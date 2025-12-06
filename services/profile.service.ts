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
