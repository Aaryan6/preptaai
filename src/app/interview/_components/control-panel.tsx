"use client";

import { Interview } from "@/lib/types";
import AudioControls from "./audio-controls";
import VideoToggle from "./video-toggle";
import { Message } from "ai";
import { useState } from "react";
import AudioVisualizer from "@/components/user-voice-visualizer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ControlPanel({
  addToConversation,
  conversation,
  interview,
}: {
  addToConversation: (message: Message) => Promise<void>;
  conversation: Message[];
  interview: Interview;
}) {
  const router = useRouter();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const handleViewResults = () => {
    router.push(`/interview/${interview.id}/result`);
  };

  return (
    <div className="flex flex-col p-4 border-t border-border bg-background">
      <div className="flex items-center gap-8">
        {/* Left side - Controls */}
        <div className="flex items-center gap-4">
          <AudioControls
            addToConversation={addToConversation}
            conversation={conversation}
            interview={interview}
            onMediaStreamChange={setMediaStream}
          />
          <VideoToggle />
        </div>

        {/* Right side - Visualizer and Results Button */}
        <div className="flex-1 flex items-center justify-between">
          <AudioVisualizer stream={mediaStream} />
          <Button variant="default" onClick={handleViewResults}>
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
}
