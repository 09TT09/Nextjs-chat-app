"use client";

import Button from "./button";

interface FriendsRequestsProps {
  requests: any[];
  user: any;
  respondToFriendRequest: (requestId: number, accepted: boolean) => void | Promise<void>;
}

export default function FriendsRequests({requests, user, respondToFriendRequest} : FriendsRequestsProps)  {
  return(
    <div className="flex-1 flex flex-col p-6 border rounded-md bg-primary border-accent shadow-lg">
      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-lg text-white">Demandes d'amis reçues</h3>
        <div className={`flex justify-center items-center min-w-16 h-7 border rounded-full bg-secondary ${requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").length > 0 ? "border-orange-500" : "border-accent" }`} >
          <p>{requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").length}</p>
        </div>
      </div>

      {requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").length > 0 ? (
      requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").map((req) => (
      <div key={req.id} className="flex justify-between items-center p-2 mb-2 w-full border rounded-md border-accent bg-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>
          <div className="flex flex-col">
            <p>{req.sender.email}</p>
            <p>{req.sender.firstname} {req.sender.firstname}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button text="Accepter" variant="accept" onClick={() => respondToFriendRequest(req.id, true)} />
          <Button text="Refuser" variant="refuse" onClick={() => respondToFriendRequest(req.id, false)} />
        </div>
      </div>
      ))
      ) : (
        <p className="text-gray-500">Aucune demande reçue</p>
      )}
    </div>
  )
}