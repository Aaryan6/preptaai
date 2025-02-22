"use server";

import { Message } from "ai";
import { createClient } from "@/utils/supabase/server";
import { ChatMessages } from "@/lib/types";

export async function storeMessage(message: Message, interviewId: string) {
  const supabase = await createClient();

  const messageToStore = {
    interview_id: interviewId,
    content: message.content,
    role: message.role,
    id: message.id,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("messages").insert(messageToStore);

  if (error) {
    console.error("Error storing message:", error);
    throw new Error(`Failed to store message: ${error.message}`);
  }
}

export async function getMessages(
  interviewId: string
): Promise<ChatMessages[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("interview_id", interviewId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error(error.message);
  }

  return data || [];
}
