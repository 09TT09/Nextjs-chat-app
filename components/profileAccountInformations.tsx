"use client";

interface Profile {
  email?: string | null;
  friendcode?: string | null;
}

interface ProfileAccountInformationsProps {
  profile?: Profile | null;
}

export default function ProfileAccountInformations({profile}: ProfileAccountInformationsProps) {
  return (
    <div className="flex flex-col w-full p-3 border rounded-md bg-primary border-accent shadow-lg lg:h-auto lg:p-6 lg:min-h-0">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl text-white md:text-xl">Informations sur le compte</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <div className="flex flex-col gap-1 p-3 bg-secondary rounded-md border border-accent shadow-sm">
            <span className="text-sm text-gray-400">Friend code</span>
            <span className="text-white wrap-break-word">
              {profile?.friendcode ?? "Non défini"}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 bg-secondary rounded-md border border-accent shadow-sm">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-white wrap-break-word">
              {profile?.email ?? "Non défini"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}