"use client";

import { Message } from "ai";
import { useState } from "react";
import AudioControls from "./audio-controls";
import ConversationSidebar from "./sidebar";
import VideoComponent from "./video-component";
import { Button } from "./ui/button";

export default function InterviewLayout() {
  const [conversation, setConversation] = useState<Message[]>([]);

  const addToConversation = (message: Message) => {
    setConversation((prev) => [...prev, message]);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ConversationSidebar conversation={conversation} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <VideoComponent />
        </div>
        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-center justify-center gap-4">
            <AudioControls
              addToConversation={addToConversation}
              conversation={conversation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
