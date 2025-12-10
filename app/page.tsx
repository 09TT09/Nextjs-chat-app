"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useFriendRequests } from "@/hooks/useFriendRequest";
import { useConversations } from "@/hooks/useConversation";
import { useFriends } from "@/hooks/useFriends";
import Header from "@/components/header";
import FriendCode from "@/components/friendCode";
import FriendsList from "@/components/friendsList";
import AddFriend from "@/components/addFriend";
import FriendsRequests from "@/components/friendsRequests";
import FriendsRequestsNotifications from "@/components/friendsRequestsNotifications";
import ConversationsList from "@/components/conversationsList";
import Conversation from "@/components/conversation";
import Loading from "@/components/loading";

export default function Home() {
  const router = useRouter();
  const { user, loadingAuthUser, logout } = useAuth();

  /* Redirect the user if not authenticated */
  useEffect(() => {
    if (!user && !loadingAuthUser) router.replace("/login");
  }, [loadingAuthUser, user, router]);

  const { profile, profileLoading } = useProfile(user?.id ?? null);
  const {
    sendFriendRequest, 
    friendCode,
    setFriendCode,
    addFriendRequestloading,
    sentRequestStatus,
    respondToFriendRequest,
    requests,
    notifications,
  } = useFriendRequests(user?.id ?? null)
  const { conversations, createOrOpenConversation } = useConversations(user?.id ?? null);
  const { friends } = useFriends(user?.id ?? null)

  const [friendWindow, setFriendWindow] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  /* Display a loading screen when the user and is profile are not loaded */
  if (!user || loadingAuthUser || profileLoading) {
    return <Loading />
  }

  /* Open a conversation in the right panel */
  async function openConversation(friendId: string) {
    try {
      const id = await createOrOpenConversation(friendId);
      setSelectedConversationId(id);
      setFriendWindow(false);
    }
    catch (error) {
      console.error("Failed to open conversation:", error);
    }
  }

  /* Open a conversation in the right panel */
  function handleOpenConversation(conversationId: string) {
    setSelectedConversationId(conversationId);
  }

  /* Switch the components shown on screen */
  function displayAddFriendWindow() {
    setFriendWindow((state) => !state);
  }

  /* Display the correct conversation component */
  function setActiveConversation() {
    if (selectedConversationId) {
      return (
        <Conversation user={user!} conversationId={selectedConversationId} />
      )
    }
    else {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-md text-white">Sélectionnez une conversation</p>
        </div>
      )
    }
  }

  return (
    <div className="flex items-center flex-col w-full h-full lg:h-screen">
      <Header user={user} picture={profile!.picture} displayAddFriendWindow={displayAddFriendWindow} logout={logout} />
      {friendWindow ? (
        <div className="flex-1 flex flex-col w-full max-h-none p-3 gap-3 lg:max-h-[calc(100vh-4rem)] lg:flex-row lg:p-6 lg:gap-6">
          <div className="flex-1 flex flex-col w-full max-h-full min-h-0 gap-3 lg:w-1/2 lg:gap-6">
            <FriendCode myFriendCode={profile!.friendcode} />
            <FriendsList friends={friends} onOpenConversation={async (friendId: string) => openConversation(friendId)} />
          </div>
          <div className="flex-1 flex flex-col w-full max-h-full min-h-0 gap-3 lg:w-1/2 lg:gap-6">
            <AddFriend friendCode={friendCode} loading={addFriendRequestloading} setFriendCode={setFriendCode} sendFriendRequest={sendFriendRequest} sentRequestStatus={sentRequestStatus} />
            <FriendsRequests requests={requests} user={user} respondToFriendRequest={respondToFriendRequest} />
            <FriendsRequestsNotifications notifications={notifications} />
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
          <div className="w-8/20 p-3 border-r border-accent bg-primary">
            <h3 className="text-lg text-white mb-3">Conversations</h3>
            <div className="mt-3">
              <ConversationsList conversations={conversations} onSelectConversation={handleOpenConversation} />
            </div>
          </div>
          <div className="flex-1">
            {setActiveConversation()}
          </div>
        </div>
      )}
    </div>
  );
}