"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUIStore } from "@/stores/ui.store";
import Header from "@/components/header";
import Loading from "@/components/loading";
import InputText from "@/components/inputText";
import Image from "next/image";
import Button from "@/components/button";

export default function CreateConversation() {
  const router = useRouter();
  const { setFriendWindow } = useUIStore();
  const { user, loadingAuthUser, logout } = useAuth();
  const { profile, profileLoading } = useProfile(user?.id ?? null);

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
        <div className="flex flex-col items-center p-3 border rounded-md bg-primary border-accent shadow-lg lg:p-6">
          <Image src="/images/temporaire.png" alt="Image de conversation" className="align-middletext-center object-cover rounded-full border border-accent drag-none mb-12" width={100} height={100} />
          <InputText name="name" label="Titre de la conversation" />
          <InputText name="searchFriend" label="Rechercher un ami" />
          <Button text="Ajouter un ami" />
          <div className="mb-3"></div>
          <Button text="Créer la conversation" />
        </div>
      </div>
    </div>
  )
}