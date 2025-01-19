"use client";

import { useState } from "react";
import VideoComponent from "./video-component";
import AudioControls from "./audio-controls";
import ConversationSidebar from "./sidebar";

export default function InterviewLayout() {
  const [conversation, setConversation] = useState<string[]>([]);

  const addToConversation = (text: string) => {
    setConversation((prev) => [...prev, text]);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <ConversationSidebar conversation={conversation} />
      <div className="flex-1 flex flex-col p-4">
        <VideoComponent />
        <AudioControls onSpeechRecognized={addToConversation} />
      </div>
    </div>
  );
}
