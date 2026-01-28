"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUIStore } from "@/stores/ui.store";
import { useFriends } from "@/hooks/useFriends";
import Header from "@/components/header";
import Loading from "@/components/loading";
import InputText from "@/components/inputText";
import Image from "next/image";
import Button from "@/components/button";
import { useActionState } from 'react';
import { createConversation } from "./actions";

export default function CreateConversation() {
  const router = useRouter();
  const { setFriendWindow } = useUIStore();
  const { user, loadingAuthUser, logout } = useAuth();
  const { profile, profileLoading } = useProfile(user?.id ?? null);
  const { friends } = useFriends(user?.id ?? null)
  const [friendsToAdd, setFriendsToAdd] = useState<string[]>([]);
  
  const [state, formAction] = useActionState(createConversation, {
    error: {},
    values: {},
  })

  /* Redirect to login if not authenticated */
  useEffect(() => {
    if (!user && !loadingAuthUser) {
      router.replace("/login");
    }
  }, [user, loadingAuthUser, router]);

  if (!user || loadingAuthUser || profileLoading) {
    return <Loading />;
  }

  /* Go to the home page */
  function goToHomePage() {
    setFriendWindow(true);
    router.replace("/");
  }

  return (
    <div className="flex items-center flex-col w-full h-full lg:h-screen">
      <Header
        user={user}
        picture={profile!.picture}
        displayAddFriendWindow={goToHomePage}
        logout={logout}
      />

      <div className="flex-1 flex flex-col overflow-y-auto w-full max-h-screen p-6 gap-4">
        <h1 className="text-3xl md:text-4xl">Créer une nouvelle conversation</h1>

        <form className="flex flex-col items-center p-6 border rounded-md bg-primary border-accent shadow-lg ">
          <Image src="/images/temporaire.png" alt="Image de conversation" className="align-middletext-center object-cover rounded-full border border-accent drag-none mb-12" width={100} height={100} />
          <InputText name="name" label="Titre de la conversation" />

          {/* Hidden inputs for server action */}
          {friendsToAdd.map(id => (
            <input key={id} type="hidden" name="added-friends" value={id} />
          ))}

          <div className="w-full">
            <div className="flex flex-col w-full p-6 border rounded-md bg-primary border-accent shadow-lg">
              <h2 className="text-lg text-white mb-3">Ajouter des amis</h2>
              <InputText name="searchFriend" label="Rechercher un ami" required={false} />
              <div className="flex flex-col">

                <p className="mb-2">Liste d'amis</p>
                {friends.map((friend) => 
                  !friendsToAdd.includes(friend.id) ? (
                    <div key={friend.id} className="flex items-center justify-between gap-3 p-3 border rounded-md border-accent shadow-md bg-secondary">
                      <div className="flex w-full items-center gap-3 mr-3">
                        {friend.picture
                          ? (
                            <div className="shrink-0 relative w-12 h-12">
                              <Image src={friend.picture} fill unoptimized alt="image de profile" className="object-cover rounded-full border border-accent drag-none"/>
                            </div>
                          )
                          : ( <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div> )}

                        <div className="flex flex-col w-full max-w-50 xs:w-50">
                          <p className="text-white font-semibold">{friend.pseudo}</p>
                          <p className="text-gray-400 text-sm">{friend.email}</p>
                        </div>
                        <div className="flex flex-row justify-end w-full gap-2">
                          <Button text="Ajouter" imgAlt="Options" variant="secondary" onClick={() => setFriendsToAdd(prev => [...prev, friend.id])} />
                        </div>
                      </div>
                    </div>
                  ) : null
                )}

                <p className="my-2">Amis à invités lors de la création</p>
                {friendsToAdd.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">Aucun ami sélectionné</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {friendsToAdd.map((friendId) => {
                      const friend = friends.find(f => f.id === friendId);
                      return friend ? (
                        <div key={friend.id} className="flex items-center justify-between gap-3 p-3 border rounded-md border-accent shadow-md bg-secondary">
                          <div className="flex w-full items-center gap-3 mr-3">
                            {friend.picture
                              ? (
                                <div className="shrink-0 relative w-12 h-12">
                                  <Image src={friend.picture} fill unoptimized alt="image de profile" className="object-cover rounded-full border border-accent drag-none"/>
                                </div>
                              )
                              : ( <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div> )}

                            <div className="flex flex-col w-full max-w-50 xs:w-50">
                              <p className="text-white font-semibold">{friend.pseudo}</p>
                              <p className="text-gray-400 text-sm">{friend.email}</p>
                            </div>
                            <div className="flex flex-row justify-end w-full gap-2">
                              <Button text="Supprimer" imgAlt="Options" variant="refuse" onClick={() => setFriendsToAdd(prev => prev.filter(friendId => friendId !== friend.id))} />
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

              </div>
            </div>
          </div>
          <div className="mb-3"></div>
          <Button formAction={formAction} text="Créer la conversation" />
        </form>

      </div>
    </div>
  )
}