"use client";

import { Conversation } from "@/types/conversation";

interface ConversationsListProps {
  conversations: Conversation[];
  onMessage: (otherUserId: string) => void;
}

export default function ConversationsList({conversations, onMessage} : ConversationsListProps)  {
  console.log(conversations)

  return(
    <>
      {conversations?.length > 0 ? (
        conversations.map((conversation) => (
          <div key={conversation.conversationId} onClick={() => conversation.otherUser && onMessage(conversation.otherUser.id)} className="flex items-center gap-3 p-3 border rounded-md border-accent shadow-md bg-secondary cursor-pointer">
            <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>
            <div className="flex flex-col">
              <p className="text-white text-sm">{conversation.otherUser?.pseudo ?? "Unknown user"}</p>
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
        <p className="text-gray-500">Aucune conversations</p>
      )}
    </>
  )
}