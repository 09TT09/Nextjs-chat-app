"use client";

import Button from "@/components/button";
import InputText from "@/components/inputText";

interface Profile {
  pseudo?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  friendcode?: string | null;
}

interface ProfilePersonalInformationsProps {
  profile?: Profile | null;
  successMessage?: string;
  errorMessage?: string;
  editableValues: { pseudo: string; firstname: string; lastname: string; };
  editMode?: boolean;
  setEditMode: (editMode: boolean) => void;
  cancelEdit: () => void;
  saveEdit: () => void;
  setEditableValues: React.Dispatch<React.SetStateAction<{ pseudo: string; firstname: string; lastname: string; }>>;
}

export default function ProfilePersonalInformations({profile, successMessage, errorMessage, editableValues, editMode, setEditMode, cancelEdit, saveEdit, setEditableValues}: ProfilePersonalInformationsProps) {
  return (
    <div className="flex flex-col gap-6 p-3 border rounded-md bg-primary border-accent shadow-lg lg:p-6">
      <div className="flex justify-between">
        <h2 className="text-xl text-white md:text-xl">Informations personnelles</h2>
        <div className="flex justify-end gap-3 mb-4">
          {!editMode
            ? ( <Button text="Modifier" variant="secondary" onClick={() => setEditMode(true)} />)
            : (
              <>
                <Button text="Annuler" variant="cancel" onClick={cancelEdit} />
                <Button text="Enregistrer" variant="secondary" onClick={saveEdit} />
              </>
            )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          {editMode ? (
            <>
              <InputText
                name="firstname"
                label="Prénom"
                value={editableValues.firstname}
                onChange={(e) => setEditableValues((prev) => ({ ...prev, firstname: e.target.value, }))}
                variant="variant-1"
              />
              <InputText
                name="lastname"
                label="Nom"
                value={editableValues.lastname}
                onChange={(e) => setEditableValues((prev) => ({ ...prev, lastname: e.target.value, }))}
                variant="variant-1"
              />
              <InputText
                name="pseudo"
                label="Pseudo"
                value={editableValues.pseudo}
                onChange={(e) => setEditableValues((prev) => ({ ...prev, pseudo: e.target.value, }))}
                variant="variant-1"
              />
            </>
          ) : (
            <>
              {/* VIEW MODE */}
              {[
                { label: "Prénom", value: profile?.firstname },
                { label: "Nom", value: profile?.lastname },
                { label: "Pseudo", value: profile?.pseudo },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 p-3 bg-secondary rounded-md border border-accent shadow-sm"
                >
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="text-white wrap-break-word">
                    {item.value ?? "Non défini"}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
          {successMessage && (
            <div className="p-3 mb-4 rounded-md bg-green-600 text-white border border-green-800">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 mb-4 rounded-md bg-red-600 text-white border border-red-800">
              {errorMessage}
            </div>
          )}
      </div>
    </div>
  )
}