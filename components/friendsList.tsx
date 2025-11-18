"use client";

import Button from "./button";

interface FriendsListProps {
  friends: any[];
}

export default function FriendsList({friends} : FriendsListProps)  {

  return(
    <div className="flex flex-col w-1/2 p-6 border rounded-md bg-primary border-accent shadow-lg">
      <h3 className="text-lg text-white mb-3">Liste d'amis</h3>
      {friends.length > 0 ? (
      <div className="flex flex-col gap-2">
        {friends.map((friend) => (
        <div key={friend.id} className="flex items-center justify-between p-3 border rounded-md border-accent shadow-md">
          <div className="flex items-center gap-3">
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>

            <div className="flex flex-col">
              <span className="text-white font-semibold">{friend.email ?? "Utilisateur"}</span>
              <span className="text-gray-400 text-sm">Code ami : {friend.friendcode}</span>
            </div>
          </div>

          <Button text="Message" variant="secondary"/>
        </div>
        ))}
      </div>
      ) : (
        <p className="text-gray-500">Vous n'avez aucun ami pour le moment</p>
      )}
    </div>
  )
}