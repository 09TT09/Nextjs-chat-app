"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile";
import type { FriendRequest } from "@/types/friendRequest";
import type { Conversation } from "@/types/conversation";

export function useFriends() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [friendCode, setFriendCode] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [sentRequestStatus, setSentRequestStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // Load user, friends requests and friends
  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoadingUser(false);
        return;
      }

      setUser(user);

      const { data: reqData, error } = await supabase
        .from("friend_requests")
        .select(`*, sender:profiles!friend_requests_sender_id_fkey (*), receiver:profiles!friend_requests_receiver_id_fkey (*)`)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!error && reqData) {
        setRequests(reqData);

        const accepted = reqData.filter(r => r.status === "accepted");
        setFriends(
          accepted.map(r =>
            r.sender_id === user.id ? r.receiver : r.sender
          )
        );
      }

      setLoadingUser(false);
    }

    fetchData();
  }, [supabase]);

  // Load user's conversations
  useEffect(() => {
    if (!user) return;

    async function loadConversations() {
      const { data: participantRows, error } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user!.id);

      if (error) {
        console.error("Error loading conversations:", error);
        return;
      }

      if (!participantRows || participantRows.length === 0) {
        setConversations([]);
        return;
      }

      const conversationIds = participantRows.map((row) => row.conversation_id);

      const { data: conversationsData, error: convError } = await supabase
        .from("conversations")
        .select(`
          id,
          name,
          user_to_user,
          created_at,
          conversation_participants (
            user_id,
            profiles:profiles (
              id,
              pseudo,
              email,
              picture,
              friendcode
            )
          )
        `)
        .in("id", conversationIds)
        .order("created_at", { ascending: false });

      if (convError) {
        console.error("Error fetching conversations:", convError);
        return;
      }

      const formatted: Conversation[] = conversationsData.map((conv) => {
        const participants: Profile[] = conv.conversation_participants.flatMap((p) => p.profiles);

        const otherUser = participants.find((p) => p.id !== user!.id) ?? null;

        return {
          conversationId: conv.id,
          name: conv.name,
          otherUser,
          createdAt: conv.created_at,
          participants,
        };
      });

      setConversations(formatted);
    }

    loadConversations();
  }, [supabase, user]);

  // Realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("friend-requests")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "friend_requests" },
        async (payload) => {
          const request = payload.new as FriendRequest;

          if (request.sender_id !== user.id && request.receiver_id !== user.id) {
            return;
          }

          const { data: sender } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", request.sender_id)
            .single();

          const { data: receiver } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", request.receiver_id)
            .single();

          const enriched = { ...request, sender, receiver };

          if (payload.eventType === "INSERT") {
            setRequests(prev => [enriched, ...prev]);

            if (request.receiver_id === user.id) {
              setNotifications(prev => [
                ...prev,
                `📩 Nouvelle demande d'ami reçue de ${sender?.pseudo ?? "?"}`,
              ]);
            }
          }

          if (payload.eventType === "UPDATE") {
            setRequests(prev => prev.map(r =>
              r.id === enriched.id ? enriched : r
            ));

            if (request.status === "accepted" && request.sender_id === user.id) {
              setFriends(prev => [...prev, receiver]);
              setNotifications(prev => [
                ...prev,
                `✅ ${receiver?.pseudo ?? "Utilisateur"} a accepté votre demande !`,
              ]);
            }

            if (request.status === "rejected" && request.sender_id === user.id) {
              setNotifications(prev => [
                ...prev,
                `❌ ${receiver?.pseudo ?? "Utilisateur"} a refusé votre demande.`,
              ]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user]);

  // Send friend request
  async function sendFriendRequest() {
    if (!friendCode.trim()) {
      setSentRequestStatus({ type: "error", message: "Veuillez entrer un code ami." });
      return;
    }

    setLoadingRequest(true);

    try {
      if (!user) {
        setSentRequestStatus({ type: "error", message: "Vous devez être connecté." });
        return;
      }

      const { data: receiver, error } = await supabase.from("profiles").select("id").eq("friendcode", friendCode).single();

      if (error || !receiver) {
        setSentRequestStatus({ type: "error", message: "Aucun utilisateur trouvé avec ce code." });
        return;
      }

      if (receiver.id === user.id) {
        setSentRequestStatus({ type: "error", message: "Vous ne pouvez pas vous ajouter vous-même." });
        return;
      }

      const { error: insertError } = await supabase
        .from("friend_requests")
        .insert({ sender_id: user.id, receiver_id: receiver.id, });

      if (insertError) {
        setSentRequestStatus({ type: "error", message: insertError.message });
      } else {
        setSentRequestStatus({ type: "success", message: "Demande envoyée !" });
      }
    } finally {
      setLoadingRequest(false);
    }
  }

  // Accept or reject friend request
  async function respondToFriendRequest(id: number, accepted: boolean) {
    await supabase.from("friend_requests").update({ status: accepted ? "accepted" : "rejected" }).eq("id", id);
  }

  // logout
  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return {
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
  };
}
