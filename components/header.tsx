"use client";

import Button from "@/components/button";
import LogoutIcon from "@/public/logout.svg"
import friendsIcon from "@/public/friends.svg"
import ConversationIcon from "@/public/conversation.svg"
import { useWindowWidth } from "@/hooks/useWindowWidth";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
  displayAddFriendWindow: () => void;
  logout: () => void;
}

export default function Header({user, displayAddFriendWindow, logout}: HeaderProps)  {
  const width = useWindowWidth();

  return(
    <div className="shrink-0 flex justify-between items-center gap-2 w-full h-16 px-6 border-b bg-primary border-accent shadow-lg">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>
        {width > 640 && (
          <div className="w-80">
            {user ? <p>{user.email}</p> : <p>Utilisateur non connecté</p>}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-3">
        <Button imgSrc={ConversationIcon} imgAlt="Créer une conversation" variant="icon" />
        <Button onClick={displayAddFriendWindow} imgSrc={friendsIcon} imgAlt="Gestions des amis" variant="icon" />
        <Button onClick={logout} imgSrc={LogoutIcon} imgAlt="Déconnexion" imgColorInverted={true} variant="icon2"></Button>
      </div>
    </div>
  )
}