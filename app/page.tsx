"use client"

import { redirect } from 'next/navigation'
//import { createClient } from '@/utils/supabase/server'
import { useState, useEffect  } from 'react'
import { createClient } from "@/utils/supabase/client"

export default function Home() {
  const supabase = createClient()
  //const supabase = await createClient()

  const [friendWindow, setFriendWindow] = useState(false)
  const [friendCode, setFriendCode] = useState("")
  const [notifications, setNotifications] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  // Get current user + load requests on mount
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      // Load all friend requests for this user
      const { data, error } = await supabase
        .from("friend_requests")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setRequests(data)
      }

      // Setup realtime subscription
      const channel = supabase
        .channel("friend-requests")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "friend_requests",
          },
          (payload) => {
            const request = payload.new as any;

            // Only process if current user is involved
            if (request.sender_id !== user.id && request.receiver_id !== user.id) return;

            if (payload.eventType === "INSERT" && request.receiver_id === user.id) {
              setRequests((prev) => [request, ...prev]);
              setNotifications((prev) => [
                ...prev,
                `📩 Nouvelle demande d’ami reçue de ${request.sender_id}`,
              ]);
            }

            if (payload.eventType === "UPDATE") {
              setRequests((prev) =>
                prev.map((r) => (r.id === request.id ? request : r))
              );

              if (request.status === "accepted" && request.sender_id === user.id) {
                setNotifications((prev) => [
                  ...prev,
                  `✅ Votre demande d’ami a été acceptée par ${request.receiver_id}`,
                ]);
              }
              if (request.status === "rejected" && request.sender_id === user.id) {
                setNotifications((prev) => [
                  ...prev,
                  `❌ Votre demande d’ami a été refusée par ${request.receiver_id}`,
                ]);
              }
            }
          }
        )
        .subscribe();


      return () => {
        supabase.removeChannel(channel)
      }
    }

    fetchData()
  }, [])


  /********************************************* */

  // Send friend request
  async function sendFriendRequest() {
    if (!friendCode.trim()) return alert("Veuillez entrer un code ami")
    setLoading(true)

    try {
      if (!user) return alert("Vous devez être connecté")

      const { data: receiver, error: findError } = await supabase
        .from("profiles")
        .select("id")
        .eq("friendcode", friendCode)
        .single()

      if (findError || !receiver) {
        alert("Aucun utilisateur trouvé avec ce code")
        return
      }

      const { error: insertError } = await supabase.from("friend_requests").insert({
        sender_id: user.id,
        receiver_id: receiver.id,
      })

      if (insertError) alert("Erreur : " + insertError.message)
      else alert("Demande envoyée ✅")
    } finally {
      setLoading(false)
    }
  }


  /*********************************** */

  // Respond to a request (accept/reject)
  async function respondToFriendRequest(requestId: number, accepted: boolean) {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: accepted ? "accepted" : "rejected" })
      .eq("id", requestId)

    if (error) console.error(error)
  }

  /*
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }
  */

  function displayAddFriendWindow() {
    setFriendWindow(!friendWindow)
  }

  return (
    <div className="flex items-center flex-col w-full min-h-screen">
      <div className="flex items-center gap-2 w-full h-14 border-b border-b-teal-500 bg-stone-950">
        <button
          className="h-10 min-w-36 rounded-md bg-teal-500 text-black p-2 cursor-pointer transition duration-250 hover:bg-teal-300"
        >
          Créer une conversation
        </button>
        <button
          className="h-10 min-w-36 rounded-md bg-teal-500 text-black p-2 cursor-pointer transition duration-250 hover:bg-teal-300"
          onClick={displayAddFriendWindow}
        >
          Amis
        </button>
      </div>

      {friendWindow ? (
        <div className="mt-6 w-full max-w-md flex flex-col items-center">
          {/* --- Add friend by code --- */}
          <h3 className="text-lg text-teal-400 mb-2">Ajouter un ami</h3>
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="Entrez un code ami"
              className="p-2 rounded-md border border-teal-500 text-black w-56"
            />
            <button
              disabled={loading}
              onClick={sendFriendRequest}
              className="bg-teal-500 text-black rounded-md px-4 py-2 hover:bg-teal-300 transition disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </div>

          {/* --- Received friend requests --- */}
          <h3 className="text-lg text-teal-400 mb-2">Demandes d’amis reçues</h3>
          {requests.filter((r) => r.receiver_id === user?.id && r.status === "pending").length > 0 ? (
            requests
              .filter((r) => r.receiver_id === user?.id && r.status === "pending")
              .map((req) => (
                <div
                  key={req.id}
                  className="flex justify-between bg-stone-900 p-2 rounded-md mb-2 w-full"
                >
                  <p>{req.sender_id}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToFriendRequest(req.id, true)}
                      className="bg-green-500 text-black rounded px-2 py-1"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => respondToFriendRequest(req.id, false)}
                      className="bg-red-500 text-black rounded px-2 py-1"
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500">Aucune demande reçue</p>
          )}
        </div>
      ) : (
        <p>Connecté</p>
      )}

      {/* Notifications */}
      <div className="mt-4">
        {notifications.length > 0 ? (
          notifications.map((msg, i) => (
            <p key={i} className="text-sm text-gray-200">
              {msg}
            </p>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Aucune notification</p>
        )}
      </div>

    </div>
  );
}
