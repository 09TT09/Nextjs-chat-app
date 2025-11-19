"use client";

import { redirect, useRouter } from "next/navigation";
import { useFriends } from "@/hooks/useFriends";
import { useState } from "react";

import Button from "@/components/button";
import FriendsList from "@/components/friendsList";
import AddFriend from "@/components/addFriend";
import FriendsRequests from "@/components/friendsRequests";
import FriendsRequestsNotifications from "@/components/friendsRequestsNotifications";
import Header from "@/components/header";

export default function Home() {
  const router = useRouter();
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
  } = useFriends();

  const [friendWindow, setFriendWindow] = useState(false);

  // If the hook finished loading but no user: redirect
  if (!loadingUser && !user) {
    redirect("/login");
  }

  function displayAddFriendWindow() {
    setFriendWindow((prev) => !prev);
  }

  return (
    <div className="flex items-center flex-col w-full min-h-screen">
      <Header user={user} displayAddFriendWindow={displayAddFriendWindow} />
      {friendWindow ? (
        <div className="flex-1 flex flex-row w-full p-6 gap-6">
          <FriendsList friends={friends} />
          <div className="flex flex-col w-1/2 gap-6">
            <AddFriend friendCode={friendCode} loading={loadingRequest} setFriendCode={setFriendCode} sendFriendRequest={sendFriendRequest} />
            <FriendsRequests requests={requests} user={user} respondToFriendRequest={respondToFriendRequest} />
            <FriendsRequestsNotifications notifications={notifications} />
          </div>
        </div>
      ) : (
        <p>Connecté</p>
      )}
    </div>
  );
}
