"use client";

import { Message } from "ai";
import { useEffect, useState } from "react";
import AudioControls from "./audio-controls";
import ConversationSidebar from "../../../components/sidebar";
import VideoComponent from "../../../components/video-component";
import { Interview } from "@/lib/types";
import { getMessages, storeMessage } from "@/actions/messages";
import ControlPanel from "./control-panel";

type InterviewLayoutProps = {
  interview: Interview;
};

export default function InterviewLayout({ interview }: InterviewLayoutProps) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await getMessages(interview.id);
        setConversation(
          messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as "user" | "assistant",
          }))
        );
        setError(null);
      } catch (error) {
        console.error("Error loading messages:", error);
        setError("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [interview.id]);

  const addToConversation = async (message: Message) => {
    try {
      await storeMessage(message, interview.id);
      setConversation((prev) => [...prev, message]);
      setError(null);
    } catch (error) {
      console.error("Error storing message:", error);
      setError("Failed to store message");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <ConversationSidebar conversation={conversation} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <VideoComponent />
        </div>
        <ControlPanel
          addToConversation={addToConversation}
          conversation={conversation}
          interview={interview}
        />
      </div>
    </div>
  );
}
