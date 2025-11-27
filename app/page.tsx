"use client";

import { useRouter } from "next/navigation";
import { useFriends } from "@/hooks/useFriends";
import { useChat } from "@/hooks/useChat";
import { useState, useEffect } from "react";

import FriendsList from "@/components/friendsList";
import AddFriend from "@/components/addFriend";
import FriendsRequests from "@/components/friendsRequests";
import FriendsRequestsNotifications from "@/components/friendsRequestsNotifications";
import ConversationsList from "@/components/conversationsList";
import Header from "@/components/header";

export default function Home() {
  const router = useRouter();
  const { createOrOpenConversation } = useChat();
  const {
    user,
    loadingUser,
    friendCode,
    setFriendCode,
    friends,
    requests,
    notifications,
    loadingRequest,
    sendFriendRequest,
    respondToFriendRequest,
    sentRequestStatus,
    conversations,
    logout,
  } = useFriends();
  const [friendWindow, setFriendWindow] = useState(false);

  // Redirect the user after hydration if not connected
  useEffect(() => {
    if (!loadingUser && !user) {
      router.replace("/login");
    }
  }, [router, loadingUser, user]);

  if (!user) return null;

  // Change the displayed component
  function displayAddFriendWindow() {
    setFriendWindow((prev) => !prev);
  }

  // Open the correct conversation
  function onMessage(otherUserId: string) {
    createOrOpenConversation(user!.id, otherUserId);
  }

  return (
    <div className="flex items-center flex-col w-full h-full lg:h-screen">
      <Header user={user} displayAddFriendWindow={displayAddFriendWindow} logout={logout} />
      {friendWindow ? (
        <div className="flex-1 flex flex-col w-full max-h-none p-3 gap-3 lg:max-h-[calc(100vh-4rem)] lg:flex-row lg:p-6 lg:gap-6">
          <FriendsList friends={friends} currentUserId={user?.id} />
          <div className="flex-1 flex flex-col w-full max-h-full min-h-0 gap-3 lg:w-1/2 lg:gap-6">
            <AddFriend friendCode={friendCode} loading={loadingRequest} setFriendCode={setFriendCode} sendFriendRequest={sendFriendRequest} sentRequestStatus={sentRequestStatus} />
            <FriendsRequests requests={requests} user={user} respondToFriendRequest={respondToFriendRequest} />
            <FriendsRequestsNotifications notifications={notifications} />
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
          <div className="w-8/20 p-3 border-r border-accent bg-primary">
            <h3 className="text-lg text-white mb-3">Conversations</h3>
            <div className="mt-3">
              <ConversationsList conversations={conversations} onMessage={onMessage} />
            </div>
          </div>
          <div className="flex-1"></div>
        </div>
      )}
    </div>
  );
}
