"use client";

import Button from "./button";

interface FriendsListProps {
  friendCode: string;
  loading: boolean;
  setFriendCode: (value: string) => void;
  sendFriendRequest: () => void | Promise<void>;
}

export default function AddFriend({friendCode, loading, setFriendCode, sendFriendRequest} : FriendsListProps)  {
  return(
    <div className="flex flex-col gap-3 p-6 border rounded-md bg-primary border-accent shadow-lg">
      <h3 className="text-lg text-white">Ajouter un ami</h3>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
          placeholder="Entrez un code ami"
          className="max-w-72 border rounded-md border-accent w-full h-10 px-2 bg-secondary"
        />
        <Button onClick={sendFriendRequest} text={loading ? "Envoi..." : "Envoyer"} variant="secondary" loading={loading}/>
      </div>
    </div>
  )
}