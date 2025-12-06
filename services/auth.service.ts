import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

/* Return the authenticated Supabase user */
export async function getAuthUser(): Promise<User | null> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/* Logout the authenticated user */
export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

