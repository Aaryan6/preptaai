"use client";

import { Interview } from "@/lib/types";
import AudioControls from "./audio-controls";
import VideoToggle from "./video-toggle";
import { Message } from "ai";
import { useState } from "react";
import AudioVisualizer from "@/components/user-voice-visualizer";
import { Button } from "@/components/ui/button";
import { updateInterview } from "@/actions/interview";
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
  const [isCompleting, setIsCompleting] = useState(false);

  const handleEndInterview = async () => {
    try {
      setIsCompleting(true);
      await updateInterview(interview.id, interview.user_id, {
        status: "completed",
      });

      // Generate and store the interview result
      const response = await fetch("/api/interview/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewId: interview.id }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to the result page
      router.push(`/interview/${interview.id}/result`);
    } catch (error) {
      console.error("Error completing interview:", error);
    } finally {
      setIsCompleting(false);
    }
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

        {/* Right side - Visualizer and End Button */}
        <div className="flex-1 flex items-center justify-between">
          <AudioVisualizer stream={mediaStream} />
          <Button
            variant="destructive"
            onClick={handleEndInterview}
            disabled={isCompleting}
          >
            {isCompleting ? "Ending..." : "End Interview"}
          </Button>
        </div>
      </div>
    </div>
  );
}
