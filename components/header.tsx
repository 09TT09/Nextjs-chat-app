"use client";

import Button from "@/components/button";

interface HeaderProps {
  user: any;
  displayAddFriendWindow: () => void;
}

export default function Header({user, displayAddFriendWindow}: HeaderProps)  {
  return(
    <div className="flex justify-between items-center gap-2 w-full h-16 px-6 border-b bg-primary border-accent shadow-lg">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>
        {user ? <p>{user.email}</p> : <p>utilisateur non connecté</p>}
      </div>

      <div className="flex justify-center items-center gap-3">
        <Button text="Créer une conversation" variant="secondary" />
        <Button onClick={displayAddFriendWindow} text="Amis" variant="secondary" />
      </div>
    </div>
  )
}