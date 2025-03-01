"use client";

import { Button } from "@/components/ui/button";
import { Interview } from "@/lib/types";
import { Message } from "ai";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import AudioControls from "./audio-controls";
import VideoToggle from "./video-toggle";
import { updateInterview } from "@/actions/interview";
import { useUser } from "@clerk/nextjs";

interface ControlPanelProps {
  addToConversation: (message: Message) => Promise<void>;
  conversation: Message[];
  interview: Interview;
  onRecordingStateChange: (state: boolean) => void;
  onProcessingStateChange: (state: boolean) => void;
}

const ControlPanel = forwardRef<
  { toggleRecording: () => void },
  ControlPanelProps
>(
  (
    {
      addToConversation,
      conversation,
      interview,
      onRecordingStateChange,
      onProcessingStateChange,
    },
    ref
  ) => {
    const router = useRouter();
    const { user } = useUser();

    const handleViewResults = async () => {
      if (!user) return;

      try {
        await updateInterview(interview.id, user.id, { status: "completed" });
        router.push(`/interview/${interview.id}/result`);
      } catch (error) {
        console.error("Error updating interview status:", error);
        // Still navigate even if the update fails
        router.push(`/interview/${interview.id}/result`);
      }
    };

    return (
      <div className="flex flex-col w-full absolute px-2 bottom-2 left-0 right-0">
        <div className="flex items-center justify-between w-full gap-8 px-6 bg-background border-2 rounded-sm">
          <div className="flex items-center gap-4">
            <VideoToggle />
          </div>
          <AudioControls
            ref={ref}
            addToConversation={addToConversation}
            conversation={conversation}
            interview={interview}
            onRecordingStateChange={onRecordingStateChange}
            onProcessingStateChange={onProcessingStateChange}
          />
          <div className="flex items-center justify-between">
            <Button
              variant="big"
              onClick={handleViewResults}
              className="bg-transparent hover:bg-foreground/90 hover:text-background text-foreground/70 border-2 border-foreground/40"
            >
              Finish <LogIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

ControlPanel.displayName = "ControlPanel";

export default ControlPanel;
