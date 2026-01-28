"use client";

import Image from 'next/image'
import { Conversation } from "@/types/conversation";

interface ConversationsListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
}

export default function ConversationsList({conversations, onSelectConversation} : ConversationsListProps)  {
  return(
    <>
      {conversations?.length > 0 ? (
        conversations.map((conversation) => (
          <div key={conversation.conversationId} onClick={() => onSelectConversation(conversation.conversationId)} className="flex items-center gap-3 p-3 border rounded-md border-accent shadow-md bg-secondary cursor-pointer">
            {conversation.otherUser?.picture
              ? (
                <div className="shrink-0 relative w-12 h-12">
                  <Image src={conversation.otherUser?.picture} fill unoptimized alt="image de profile" className="object-cover rounded-full border border-accent drag-none"/>
                </div>
              )
              : ( <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>)}
            <div className="flex flex-col">
              {conversation.userToUser ? (
                <p className="text-white text-sm">{conversation.otherUser?.pseudo ?? "Utilisateur inconnu"}</p>
              ) : (
                <p className="text-white text-sm">{conversation.name ?? "Conversation de groupe"}</p>
              )}
              {conversation.otherUser ? (
                <div className="flex items-center justify-between text-gray-300 text-sm w-full">
                  <p>👤 {conversation.otherUser.pseudo ?? conversation.otherUser.email}</p>
                </div>
              ) : (
                <p className="text-gray-400">No partner found</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Aucune conversation</p>
      )}
    </>
  )
}