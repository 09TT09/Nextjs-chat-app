"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/button";
import type { User } from "@supabase/supabase-js";
import type { Message } from "@/types/message";

interface ConversationProps {
  conversationId: string;
  user: User;
}

export default function Conversation({ user, conversationId }: ConversationProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

useEffect(() => {
  if (!conversationId) return;

  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  fetchMessages();

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
        setMessages((prev) => [...prev, payload.new as Message]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [conversationId, supabase]);


  async function sendMessage() {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  }

  return (
    <div className="flex flex-col w-full h-full p-6 gap-4">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-xs ${
              msg.user_id === user.id
                ? "bg-green-500 self-end text-white"
                : "bg-gray-700 self-start text-white"
            }`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-md border border-accent bg-secondary text-white"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button text="Send" variant="secondary" onClick={sendMessage} />
      </div>
    </div>
  );
}
