"use client";

import Button from "./button";
import { useChat } from "@/hooks/useChat";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import MessageIcon from "@/public/message.svg"

interface FriendsListProps {
  friends: any[];
  currentUserId: string;
}

export default function FriendsList({friends, currentUserId} : FriendsListProps) {
  const { createOrOpenConversation } = useChat();
  const width = useWindowWidth();

  return(
    <div className="flex flex-col w-full h-124 p-3 border rounded-md bg-primary border-accent shadow-lg lg:h-auto lg:flex-1 lg:w-1/2 lg:p-6 lg:min-h-0">
      <h3 className="text-lg text-white mb-3">Liste d'amis</h3>
      {friends.length > 0 ? (
      <div className="flex-1 flex flex-col gap-2 pr-3 overflow-y-auto">

        {friends.map((friend) => (
        <div key={friend.id} className="flex items-center justify-between gap-3 p-3 border rounded-md border-accent shadow-md bg-secondary">
          <div className="flex items-center gap-3 mr-3">
            <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>
            <div className="flex flex-col w-full max-w-50 xs:w-50">
              <p className="text-white font-semibold">{friend.pseudo}</p>
              <p className="text-gray-400 text-sm">{friend.email}</p>
              {width < 512 && (
                <div className="flex flex-row gap-2 mt-2">
                  <Button onClick={() => createOrOpenConversation(currentUserId, friend.id)} imgSrc={MessageIcon} imgAlt="Envoyer un message" variant="icon" />
                </div>
              )}
            </div>
          </div>
          {width >= 512 && (
            <div>
              <Button onClick={() => createOrOpenConversation(currentUserId, friend.id)} imgSrc={MessageIcon} imgAlt="Envoyer un message" variant="icon" />
            </div>
          )}
        </div>
        ))}
      </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Vous n'avez aucun ami pour le moment</p>
        </div>
      )}
    </div>
  )
}