"use client";

import { getMessages, storeMessage } from "@/actions/messages";
import { updateInterview } from "@/actions/interview";
import { Interview } from "@/lib/types";
import { Message } from "ai";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Timer, Maximize2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@clerk/nextjs";
import InterviewHeader from "./interview-header";
import InterviewVideoArea from "./interview-video-area";
import InterviewControls from "./interview-controls";
import InterviewSidebar from "./interview-sidebar";

type InterviewLayoutProps = {
  interview: Interview;
};

export default function InterviewLayout({ interview }: InterviewLayoutProps) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const audioControlsRef = useRef<{ toggleRecording: () => void } | null>(null);
  const { user } = useUser();

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

        // If there are messages, consider the interview started
        if (messages.length > 0) {
          setHasStarted(true);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [interview.id]);

  // Timer counting up when interview has started
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const addToConversation = async (message: Message) => {
    try {
      await storeMessage(message, interview.id);
      setConversation((prev) => [...prev, message]);

      // When adding a message, set the appropriate speaking state
      if (message.role === "user") {
        setIsUserSpeaking(true);
        setTimeout(() => setIsUserSpeaking(false), 1000);
      } else {
        setIsInterviewerSpeaking(true);
        setTimeout(() => setIsInterviewerSpeaking(false), 1000);
      }
    } catch (error) {
      console.error("Error storing message:", error);
    }
  };

  const handleStartRecording = async () => {
    try {
      if (user && interview.id) {
        // Update interview status to "in-progress"
        await updateInterview(interview.id, user.id, {
          status: "in-progress",
          started_at: new Date().toISOString(),
        });
      }

      setHasStarted(true);
      setIsMicEnabled(true); // Enable microphone

      // Short delay to ensure state updates before toggling recording
      setTimeout(() => {
        if (audioControlsRef.current) {
          audioControlsRef.current.toggleRecording();
        }
      }, 100);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  const toggleMic = () => {
    setIsMicEnabled((prev) => !prev);

    // If turning on the mic and audio controls exist, start recording
    if (!isMicEnabled && audioControlsRef.current && hasStarted) {
      audioControlsRef.current.toggleRecording();
    }
    // If turning off the mic and audio controls exist, stop recording
    else if (isMicEnabled && audioControlsRef.current && isRecording) {
      audioControlsRef.current.toggleRecording();
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-50">
      {/* Header */}
      <InterviewHeader
        interview={interview}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
        hasStarted={hasStarted}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div
          className={`flex-1 flex flex-col p-6 ${
            showSidebar ? "" : ""
          } relative`}
        >
          <InterviewVideoArea
            isInterviewerSpeaking={isInterviewerSpeaking}
            isUserSpeaking={isUserSpeaking}
            isGeneratingQuestion={isProcessing}
            hasStarted={hasStarted}
            handleStartRecording={handleStartRecording}
            interview={interview}
            conversation={conversation}
            isMicEnabled={isMicEnabled}
            toggleMic={toggleMic}
            onRecordingStateChange={setIsRecording}
            onProcessingStateChange={setIsProcessing}
            audioControlsRef={audioControlsRef}
          />

          {/* Controls */}
          <InterviewControls
            ref={audioControlsRef}
            setShowTranscript={() => {
              // If sidebar is not showing, show it first
              if (!showSidebar) {
                setShowSidebar(true);
              }
              // Switch to transcript tab
              setActiveTab("transcript");
            }}
            showTranscript={activeTab === "transcript" && showSidebar}
            addToConversation={addToConversation}
            conversation={conversation}
            interview={interview}
            onRecordingStateChange={setIsRecording}
            onProcessingStateChange={setIsProcessing}
            onUserSpeakingChange={setIsUserSpeaking}
            isMicEnabled={isMicEnabled}
            toggleMic={toggleMic}
          />

          {/* Sidebar toggle button */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white border-gray-200/50 shadow-lg hover:bg-gray-50"
                    onClick={() => setShowSidebar(!showSidebar)}
                  >
                    {showSidebar ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{showSidebar ? "Hide sidebar" : "Show sidebar"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Right sidebar */}
        {showSidebar && (
          <InterviewSidebar
            interview={interview}
            hasStarted={hasStarted}
            handleStartRecording={handleStartRecording}
            conversation={conversation}
            formatTime={formatTime}
            elapsedTime={elapsedTime}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}
