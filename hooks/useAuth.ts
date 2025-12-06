import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser, logoutUser } from "@/services/auth.service";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuthUser, setLoadingAuthUser] = useState(true);
  const router = useRouter();

  /* Get the authenticated user */
  useEffect(() => {
    async function loadUser() {
      const data = await getAuthUser();
      setUser(data);
      setLoadingAuthUser(false);
    }

    loadUser();
  }, []);

  /* Logout the authenticated user and redirect */
  function logout() {
    logoutUser();
    router.replace("/login");
  }

  return { user, loadingAuthUser, logout };
}
