"use client";

import Button from "./button";
import { useWindowWidth } from "@/hooks/useWindowWidth";

import type { User } from "@supabase/supabase-js";
import type { FriendRequest } from "@/types/friendRequest";

interface FriendsRequestsProps {
  requests: FriendRequest[];
  user: User;
  respondToFriendRequest: (requestId: number, accepted: boolean) => void | Promise<void>;
}

export default function FriendsRequests({requests, user, respondToFriendRequest} : FriendsRequestsProps)  {
  const width = useWindowWidth();

  return(
    <div className="flex flex-col w-full h-124 p-3 border rounded-md bg-primary border-accent shadow-lg lg:h-auto lg:flex-1 lg:p-6 lg:min-h-0">
      <div className="flex items-center gap-4 mb-3">
        <h3 className="text-md text-white md:text-lg">Demandes d&apos;amis reçues</h3>
        <div className={`flex justify-center items-center min-w-16 h-7 border rounded-full bg-secondary ${requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").length > 0 ? "border-orange-500" : "border-accent" }`} >
          <p>{requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").length}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 pr-3 overflow-y-auto">
        {requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").length > 0 ? (
          requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").map((req) => (
            <div key={req.id} className="flex flex-col justify-between items-start gap-3 p-2 mb-2 w-full border rounded-md border-accent bg-secondary xs:flex-row xs:items-center">
              <div className="flex items-center gap-3 mr-3">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>
                <div className="flex flex-col w-full max-w-50 xs:w-50">
                  <p className="text-white font-semibold">{req.sender.pseudo}</p>
                  <p className="text-gray-400 text-sm">{req.sender.email}</p>
                  {width < 512 && (
                    <div className="flex flex-row gap-2 mt-2">
                      <Button text="Accepter" variant="accept" onClick={() => respondToFriendRequest(req.id, true)} />
                      <Button text="Refuser" variant="refuse" onClick={() => respondToFriendRequest(req.id, false)} />
                    </div>
                  )}
                </div>
              </div>
              {width >= 512 && (
                <div className="flex flex-row gap-2 xs:flex-col sm:flex-row lg:flex-col xl:flex-row">
                  <Button text="Accepter" variant="accept" onClick={() => respondToFriendRequest(req.id, true)} />
                  <Button text="Refuser" variant="refuse" onClick={() => respondToFriendRequest(req.id, false)} />
                </div>
              )}
            </div>
          )
        )
        ) : (
          <p className="text-gray-500">Aucune demande reçue</p>
        )}
      </div>
    </div>
  )
}