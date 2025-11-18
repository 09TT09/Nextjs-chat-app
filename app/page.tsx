"use client"

import { redirect } from 'next/navigation'
//import { createClient } from '@/utils/supabase/server'
import { useState, useEffect  } from 'react'
import { createClient } from "@/utils/supabase/client"
import Button from '@/components/button'
import FriendsList from '@/components/friendsList'
import AddFriend from '@/components/addFriend'
import FriendsRequests from '@/components/friendsRequests'
import FriendsRequestsNotifications from '@/components/friendsRequestsNotifications'

export default function Home() {
  const supabase = createClient()
  //const supabase = await createClient()

  const [friendWindow, setFriendWindow] = useState(false)
  const [friendCode, setFriendCode] = useState("")
  const [notifications, setNotifications] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [friends, setFriends] = useState<any[]>([])

  // Get current user + load requests on mount
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      // Load all friend requests for this user
      const { data: requests, error: reqError } = await supabase
        .from("friend_requests")
        .select(`
          *,
          sender:profiles!friend_requests_sender_id_fkey (*),
          receiver:profiles!friend_requests_receiver_id_fkey (*)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false })

      if (!reqError && requests) {
        setRequests(requests)
      }

      const accepted = requests?.filter(r => r.status === "accepted") || []
      const friends = accepted.map(r => {
        return r.sender_id === user.id ? r.receiver : r.sender
      })
      setFriends(friends)

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
      <div className="flex justify-between items-center gap-2 w-full h-16 px-6 border-b bg-primary border-accent shadow-lg">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent bg-gray-400"></div>
          {user
            ? (<p>{ user.email }</p>)
            : (<p>utilisateur non connecté</p>)
          }
        </div>
        <div className="flex justify-center items-center gap-3">
          <Button text="Créer une conversation" variant="secondary" />
          <Button onClick={displayAddFriendWindow} text="Amis" variant="secondary" />
        </div>
      </div>

      {friendWindow ? (
        <div className="flex-1 flex flex-row w-full p-6 gap-6">
          <FriendsList friends={friends} />
          <div className="flex flex-col w-1/2 gap-6">
            <AddFriend friendCode={friendCode} loading={loading} setFriendCode={setFriendCode} sendFriendRequest={sendFriendRequest}/>
            <FriendsRequests requests={requests} user={user} respondToFriendRequest={respondToFriendRequest} />
            <FriendsRequestsNotifications notifications={notifications}/>
          </div>
        </div>
      ) : (
        <p>Connecté</p>
      )}
    </div>
  );
}
