"use client";

import Image from 'next/image'

interface Profile {
  picture?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  pseudo?: string | null;
  email?: string | null;
}

interface ProfileBannerProps {
  profile?: Profile | null;
}

export default function ProfileBanner({profile}: ProfileBannerProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-3 border rounded-md bg-primary border-accent shadow-lg lg:p-6 md:flex-row">
      <div className="shrink-0 relative w-32 h-32">
        {profile?.picture ? (
          <div className="shrink-0 relative w-32 h-32">
            <Image
              src={profile.picture}
              fill
              unoptimized
              loading="eager"
              alt="image de profil"
              className="object-cover rounded-full border border-accent drag-none"
            />
          </div>
        ) : (
          <div className="shrink-0 flex items-center justify-center w-32 h-32 rounded-full border border-accent bg-gray-400" />
        )}
      </div>
      <div className="flex flex-col gap-1 items-center md:items-start">
        <p className="text-xl text-white md:text-3xl">{profile?.firstname} {profile?.lastname}</p>
        <p className="text-md text-gray-400">@{profile?.pseudo}</p>
        <p className="text-md text-gray-400">{profile?.email}</p>
      </div>
    </div>
  )
}