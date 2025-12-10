import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useFriendStore } from "@/stores/friend.store";
import { getProfile } from "@/services/profile.service";
import { getFriendRequests } from "@/services/friends.service";

import type { FriendRequest } from "@/types/friendRequest";

const supabase = createClient();

export function useFriendRequests(userId: string | null) {
  const { addFriend } = useFriendStore();
  const [friendCode, setFriendCode] = useState("");
  const [addFriendRequestloading, setAddFriendRequestloading] = useState(false);
  const [sentRequestStatus, setSentRequestStatus] = useState<{ type: "error" | "success"; message: string; } | null>(null);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);

  /* Send friend request to an user with it friendcode */
  async function sendFriendRequest() {
    if (!friendCode.trim()) {
      setSentRequestStatus({ type: "error", message: "Veuillez entrer un code ami." });
      return;
    }

    setAddFriendRequestloading(true);

    try {
      if (!userId) {
        setSentRequestStatus({ type: "error", message: "Vous devez être connecté." });
        return;
      }

      const { data: receiver, error } = await supabase.from("profiles").select("id").eq("friendcode", friendCode).single();

      if (error || !receiver) {
        setSentRequestStatus({ type: "error", message: "Aucun utilisateur trouvé avec ce code." });
        return;
      }

      if (receiver.id === userId) {
        setSentRequestStatus({ type: "error", message: "Vous ne pouvez pas vous ajouter vous-même." });
        return;
      }

      const { error: insertError } = await supabase
        .from("friend_requests")
        .insert({ sender_id: userId, receiver_id: receiver.id, });

      if (insertError) {
        setSentRequestStatus({ type: "error", message: insertError.message });
      } else {
        setSentRequestStatus({ type: "success", message: "Demande envoyée !" });
      }
    } finally {
      setAddFriendRequestloading(false);
    }
  }

  /* Accept or reject friend request */
  async function respondToFriendRequest(id: number, accepted: boolean) {
    await supabase.from("friend_requests").update({ status: accepted ? "accepted" : "rejected" }).eq("id", id);
  }

  /* Load received friend requests */
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      try {
        const data = await getFriendRequests(userId);
        if (data) setRequests(data);
      } catch (error) {
        console.error("Error loading friend requests: ", error);
      } finally {
        setRequestsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  /* Update the frontend in realtime with the new friend requests */
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("friend-requests")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "friend_requests" },
        async (payload) => {
          const request = payload.new as FriendRequest;

          if (request.sender_id !== userId && request.receiver_id !== userId) return;

          const sender = await getProfile(request.sender_id)
          const receiver = await getProfile(request.receiver_id)
          const enriched = { ...request, sender, receiver };

          if (payload.eventType === "INSERT") {
            setRequests(prev => [enriched, ...prev]);
            if (request.receiver_id === userId) {
              setNotifications(prev => [ ...prev, `Nouvelle demande d'ami reçue de ${sender?.pseudo ?? "?"}` ]);
            }
          }

          if (payload.eventType === "UPDATE") {
            setRequests(prev => prev.map(r => r.id === enriched.id ? enriched : r ));

            if (request.status === "accepted") {
              if (request.sender_id === userId) {
                addFriend(receiver);
                setNotifications(prev => [ ...prev, `${receiver?.pseudo ?? "Utilisateur"} a accepté votre demande !` ]);
              } else if (request.receiver_id === userId) {
                addFriend(sender);
                setNotifications(prev => [ ...prev, `Vous êtes maintenant ami avec ${sender?.pseudo ?? "Utilisateur"} !` ]);
              }
            }
            if (request.status === "rejected") {
              if (request.sender_id === userId) {
                setNotifications(prev => [ ...prev, `${receiver?.pseudo ?? "Utilisateur"} a refusé votre demande !` ]);
              }
            }
          }

        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, addFriend]);

  return {
    sendFriendRequest,
    friendCode,
    setFriendCode,
    addFriendRequestloading,
    sentRequestStatus,
    respondToFriendRequest,
    requests,
    requestsLoading,
    notifications
  }
}
