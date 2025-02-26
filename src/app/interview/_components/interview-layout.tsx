"use client";

import { getMessages, storeMessage } from "@/actions/messages";
import { Interview } from "@/lib/types";
import { Message } from "ai";
import { useEffect, useState } from "react";
import VideoComponent from "../../../components/video-component";
import ControlPanel from "./control-panel";
import ConversationSidebar from "./sidebar/conversation";

type InterviewLayoutProps = {
  interview: Interview;
};

export default function InterviewLayout({ interview }: InterviewLayoutProps) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Error loading messages:", error);
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
    } catch (error) {
      console.error("Error storing message:", error);
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
    <div className="flex flex-1 h-full bg-background">
      <ConversationSidebar conversation={conversation} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        <VideoComponent />
        <ControlPanel
          addToConversation={addToConversation}
          conversation={conversation}
          interview={interview}
        />
      </div>
    </div>
  );
}
