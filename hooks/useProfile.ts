import { useState, useEffect } from "react";
import { getProfile } from "@/services/profile.service";
import type { Profile } from "@/types/profile";

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  /* Get the profile of the authenticated user */
  useEffect(() => {
    if (!userId) {
      return;
    }

    async function fetchProfile() {
      const data = await getProfile(userId!);
      setProfile(data);
      setProfileLoading(false);
    }

    fetchProfile();
  }, [userId]);

  return { profile, profileLoading };
}
