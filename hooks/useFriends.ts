"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useFriends() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [friendCode, setFriendCode] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // -------------------------------------------------------------
  // 1) Load user + requests + friends
  // -------------------------------------------------------------
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
        .select(`
          *,
          sender:profiles!friend_requests_sender_id_fkey (*),
          receiver:profiles!friend_requests_receiver_id_fkey (*)
        `)
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
  }, []);

  // -------------------------------------------------------------
  // 2) Realtime updates — FIXED (now fetches missing profile info)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("friend-requests")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "friend_requests" },
        async (payload) => {
          const request = payload.new as any;

          // ignore irrelevant events
          if (request.sender_id !== user.id && request.receiver_id !== user.id) {
            return;
          }

          // fetch sender & receiver profile (realtime does NOT include it)
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

          // INSERT
          if (payload.eventType === "INSERT") {
            setRequests(prev => [enriched, ...prev]);

            if (request.receiver_id === user.id) {
              setNotifications(prev => [
                ...prev,
                `📩 Nouvelle demande d’ami reçue de ${sender?.pseudo ?? "?"}`,
              ]);
            }
          }

          // UPDATE
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
  }, [user]);

  // -------------------------------------------------------------
  // 3) Send friend request
  // -------------------------------------------------------------
  async function sendFriendRequest() {
    if (!friendCode.trim()) return alert("Veuillez entrer un code ami");

    setLoadingRequest(true);

    try {
      if (!user) return alert("Vous devez être connecté");

      const { data: receiver, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("friendcode", friendCode)
        .single();

      if (error || !receiver) return alert("Aucun utilisateur trouvé");

      const { error: insertError } = await supabase
        .from("friend_requests")
        .insert({
          sender_id: user.id,
          receiver_id: receiver.id,
        });

      if (insertError) alert(insertError.message);
      else alert("Demande envoyée !");
    } finally {
      setLoadingRequest(false);
    }
  }

  // -------------------------------------------------------------
  // 4) Accept / Reject
  // -------------------------------------------------------------
  async function respondToFriendRequest(id: number, accepted: boolean) {
    await supabase
      .from("friend_requests")
      .update({ status: accepted ? "accepted" : "rejected" })
      .eq("id", id);
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
  };
}
