"use client";

import Button from "./button";

interface FriendsListProps {
  friendCode: string;
  loading: boolean;
  setFriendCode: (value: string) => void;
  sendFriendRequest: () => void | Promise<void>;
  sentRequestStatus?: { type: "error" | "success"; message: string } | null;
}

export default function AddFriend({friendCode, loading, setFriendCode, sendFriendRequest, sentRequestStatus} : FriendsListProps)  {
  return(
    <div className="flex flex-col gap-3 p-3 border rounded-md bg-primary border-accent shadow-lg lg:p-6">
      <h3 className="text-md text-white md:text-lg">Ajouter un ami</h3>
      <div>
        <div className="flex flex-col items-start gap-3 mb-1 min-[28rem]:flex-row">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="Entrez un code ami"
              className={`max-w-72 border rounded-md border-accent w-full h-10 px-2 bg-secondary ${sentRequestStatus && ((sentRequestStatus.type === "error" ? "border-red-700" : "border-green-700"))}`}
            />
            {sentRequestStatus && (
              <p className={`text-sm ${(sentRequestStatus.type === "error" ? "text-red-500" : "text-green-500")}`}>
                {sentRequestStatus.message}
              </p>
            )}
          </div>
          <Button onClick={sendFriendRequest} text={loading ? "Envoi..." : "Envoyer"} variant="secondary" loading={loading}/>
        </div>
      </div>
    </div>
  )
}