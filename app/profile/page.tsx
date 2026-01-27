"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUIStore } from "@/stores/ui.store";
import Loading from "@/components/loading";
import Header from "@/components/header";
import { updateProfile } from "@/services/profile.service";
import ProfileBanner from "@/components/profileBanner";
import ProfileAccountInformations from "@/components/profileAccountInformations";
import ProfilePersonalInformations from "@/components/profilePersonalInformations";
import ParametersSidebar from "@/components/parametersSidebar";
import { useParametersSidebarStore } from "@/stores/parametersSidebar.store";

export default function ProfilePage() {
  const router = useRouter();
  const { setFriendWindow } = useUIStore();
  const { user, loadingAuthUser, logout } = useAuth();
  const { profile, profileLoading, refreshProfile } = useProfile(user?.id ?? null);
  const [editMode, setEditMode] = useState(false);
  const [editableValues, setEditableValues] = useState({ pseudo: "", firstname: "", lastname: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen, setIsOpen } = useParametersSidebarStore();

  /* Initialize editable fields once profile is loaded */
  useEffect(() => {
    if (profile) {
      setEditableValues({
        pseudo: profile.pseudo ?? "",
        firstname: profile.firstname ?? "",
        lastname: profile.lastname ?? ""
      });
    }
  }, [profile]);

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

  /* Cancel edit mode and reset editable fields */
  function cancelEdit() {
    setEditableValues({
      pseudo: profile?.pseudo ?? "",
      firstname: profile?.firstname ?? "",
      lastname: profile?.lastname ?? ""
    });
    setEditMode(false);
  }

  /* Save the new values in the database */
  async function saveEdit() {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      await updateProfile(user!.id, {
        pseudo: editableValues.pseudo,
        firstname: editableValues.firstname,
        lastname: editableValues.lastname,
      });

      await refreshProfile();
      setEditMode(false);

      setSuccessMessage("Profil mis à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error(error);
      setErrorMessage("Une erreur est survenue lors de la mise à jour.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  }

  return (
    <div className="flex items-center flex-col w-full h-full lg:h-screen">
      <Header
        user={user}
        picture={profile!.picture}
        displayAddFriendWindow={goToHomePage}
        logout={logout}
      />

      <div className="flex w-full h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
        <ParametersSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 flex flex-col overflow-y-auto w-full max-h-screen p-6 gap-4">
          <h1 className="text-3xl md:text-4xl">Profil</h1>
          <ProfileBanner profile={profile} />
          <ProfilePersonalInformations
            profile={profile}
            editableValues={editableValues}
            editMode={editMode}
            setEditMode={setEditMode}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            setEditableValues={setEditableValues}
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
          <ProfileAccountInformations profile={profile} />
        </div>
      </div>
    </div>
  );
}
