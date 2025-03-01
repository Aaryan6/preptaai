"use client";

import { Brain, Camera, PlayCircle, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Interview } from "@/lib/types";
import { Message } from "ai";
import { useVideoStore } from "@/lib/stores/video-store";
import { useEffect, useRef } from "react";
import Image from "next/image";
import ControlPanel from "./control-panel";

interface InterviewVideoAreaProps {
  isInterviewerSpeaking: boolean;
  isUserSpeaking: boolean;
  isGeneratingQuestion: boolean;
  hasStarted: boolean;
  handleStartRecording: () => void;
  interview: Interview;
  conversation: Message[];
  isMicEnabled?: boolean;
  toggleMic?: () => void;
  onRecordingStateChange?: (state: boolean) => void;
  onProcessingStateChange?: (state: boolean) => void;
  audioControlsRef?: React.RefObject<{ toggleRecording: () => void } | null>;
}

export default function InterviewVideoArea({
  isInterviewerSpeaking,
  isUserSpeaking,
  isGeneratingQuestion,
  hasStarted,
  handleStartRecording,
  interview,
  conversation,
  isMicEnabled,
  toggleMic,
  onRecordingStateChange,
  onProcessingStateChange,
  audioControlsRef,
}: InterviewVideoAreaProps) {
  const { isVideoOn, stream } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      useVideoStore.setState({
        videoRef: videoRef as React.RefObject<HTMLVideoElement>,
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const addToConversation = async (message: Message) => {
    // This is a dummy function since the actual add to conversation is handled in the parent
    console.log("Message would be added:", message);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
      {/* AI Interviewer video */}
      <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-200/10 shadow-2xl flex items-center justify-center group">
        <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
          {isGeneratingQuestion && (
            <div className="flex items-center gap-2 bg-blue-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-blue-500/20">
              <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-300">
                Processing Response
              </span>
            </div>
          )}
        </div>

        <div className="relative w-full h-full group">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            {interview?.interviewers_info?.avatar ? (
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={interview.interviewers_info.avatar}
                  alt={interview.interviewers_info.name || "AI Interviewer"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <Avatar className="h-64 w-64 bg-gray-800 border-4 border-gray-700">
                <AvatarFallback className="text-4xl text-gray-600">
                  <Brain className="h-32 w-32 text-gray-700" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

          {/* Interviewer name at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 backdrop-blur-sm py-3 px-4 z-10 rounded-s-2xl rounded-e-2xl">
            <p className="text-white font-medium text-center">
              {interview?.interviewers_info?.name || "AI Interviewer"}
            </p>
          </div>

          {/* AI thinking animation */}
          {isGeneratingQuestion && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 flex flex-col items-center gap-6">
                <div className="relative">
                  <Brain className="h-16 w-16 text-blue-400 animate-pulse" />
                  <div className="absolute inset-0 animate-ping bg-blue-500/20 rounded-full" />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-white text-lg font-medium">
                    Analyzing Response
                  </p>
                  <p className="text-blue-300">Generating next question...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User video */}
      <div className="lg:col-span-3 relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-200/10 shadow-2xl flex items-center justify-center group">
        {isVideoOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="text-center p-12">
            <Avatar className="h-32 w-32 mx-auto bg-gray-700 border-2 border-gray-600">
              <AvatarFallback className="text-4xl text-gray-400">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <p className="text-gray-400 mt-6 text-lg">Camera turned off</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 backdrop-blur-sm py-3 px-4 z-10 rounded-s-2xl rounded-e-2xl">
          <p className="text-white font-medium text-center">You</p>
        </div>

        {/* Audio visualization */}
        {isUserSpeaking && isVideoOn && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-4">
            <div className="flex gap-1 items-end">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-400/80 rounded-full transform transition-all duration-150"
                  style={{
                    height: `${Math.random() * 24 + 4}px`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Control Panel */}
        {hasStarted &&
          toggleMic &&
          onRecordingStateChange &&
          onProcessingStateChange &&
          audioControlsRef && (
            <ControlPanel
              ref={audioControlsRef}
              addToConversation={addToConversation}
              conversation={conversation}
              interview={interview}
              onRecordingStateChange={onRecordingStateChange}
              onProcessingStateChange={onProcessingStateChange}
              isMicEnabled={isMicEnabled}
              toggleMic={toggleMic}
            />
          )}
      </div>
    </div>
  );
}
