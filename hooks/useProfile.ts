import { useState, useEffect } from "react";
import { getProfile } from "@/services/profile.service";
import type { Profile } from "@/types/profile";

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  async function fetchProfile() {
    if (!userId) return;
    const data = await getProfile(userId);
    setProfile(data);
    setProfileLoading(false);
  }

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return { profile, profileLoading, refreshProfile: fetchProfile };
}
