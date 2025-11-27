"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/button";

import type { User } from "@supabase/supabase-js";
import type { Message } from "@/types/message";

export default function ChatPage() {
  const supabase = createClient();
  const params = useParams();
  const conversationId = params?.conversationId as string;

  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    fetchUser();
  }, [supabase.auth]);

  // Fetch messages
  useEffect(() => {
    if (!conversationId) return;

    // Async fetch function
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!error && data) setMessages(data);
    };

    fetchMessages(); // call it

    // Setup Realtime subscription
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    // Clean-up must be synchronous
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  // Send message
  async function sendMessage() {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      message: newMessage.trim(),
    });

    setNewMessage("");
    setLoading(false);
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col w-full h-screen p-6 gap-4 bg-primary">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-xs ${
              msg.user_id === user.id ? "bg-green-500 self-end text-white" : "bg-gray-700 self-start text-white"
            }`}
          >
            <p>{msg.message}</p>
            <span className="text-xs text-gray-300">
              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-md border border-accent bg-secondary text-white"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button text="Send" variant="secondary" onClick={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
