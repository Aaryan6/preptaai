"use client";

import { Button } from "@/components/ui/button";
import { Interview } from "@/lib/types";
import { Message } from "ai";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import AudioControls from "./audio-controls";
import VideoToggle from "./video-toggle";

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

  const handleViewResults = () => {
    router.push(`/interview/${interview.id}/result`);
  };

  return (
    <div className="flex flex-col w-full absolute px-2 bottom-2 left-0 right-0">
      <div className="flex items-center justify-between w-full gap-8 px-6 bg-background border-2 rounded-sm">
        {/* Left side - Controls */}
        <div className="flex items-center gap-4">
          <VideoToggle />
        </div>
        <AudioControls
          addToConversation={addToConversation}
          conversation={conversation}
          interview={interview}
        />

        {/* Right side - Visualizer and Results Button */}
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
