"use client";

import { Button } from "@/components/ui/button";
import { Interview } from "@/lib/types";
import { Message } from "ai";
import { LogIn, Mic, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import VideoToggle from "./video-toggle";
import { updateInterview } from "@/actions/interview";
import { useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ControlPanelProps {
  addToConversation: (message: Message) => Promise<void>;
  conversation: Message[];
  interview: Interview;
  onRecordingStateChange: (state: boolean) => void;
  onProcessingStateChange: (state: boolean) => void;
  isMicEnabled?: boolean;
  toggleMic?: () => void;
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
      isMicEnabled = false,
      toggleMic,
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
        <div className="flex items-center justify-between w-full gap-8 px-6 py-3 bg-background border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <VideoToggle />

            {toggleMic && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full h-10 w-10 transition-all duration-300 ${
                        isMicEnabled
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg hover:from-blue-700 hover:to-blue-600"
                          : "bg-white text-gray-700 border border-gray-200/50 hover:bg-gray-50"
                      }`}
                      onClick={toggleMic}
                    >
                      {isMicEnabled ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isMicEnabled ? "Mute microphone" : "Unmute microphone"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="big"
              onClick={handleViewResults}
              className="bg-transparent hover:bg-foreground/90 hover:text-background text-foreground/70 border-2 border-foreground/40"
            >
              Finish <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

ControlPanel.displayName = "ControlPanel";

export default ControlPanel;
