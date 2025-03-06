"use client";

import { Brain, PlayCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessages, Interview } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TranscriptEntry {
  id: number;
  speaker: "You" | string;
  text: string;
  time: any;
  audio_url: string;
}

interface InterviewSidebarProps {
  interview: Interview;
  hasStarted: boolean;
  handleStartRecording: () => void;
  conversation?: ChatMessages[];
  elapsedTime?: number;
  formatTime: (seconds: number) => string;
  activeTab?: string;
  setActiveTab?: Dispatch<SetStateAction<string>>;
}

export default function InterviewSidebar({
  interview,
  hasStarted,
  handleStartRecording,
  conversation = [],
  elapsedTime = 0,
  activeTab = "details",
  formatTime,
  setActiveTab,
}: InterviewSidebarProps) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);

  useEffect(() => {
    // Update local tab state when prop changes
    setLocalActiveTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    // Convert conversation to transcript format
    if (conversation.length > 0) {
      const formattedTranscript = conversation.map((message, index) => {
        return {
          id: index + 1,
          speaker:
            message.role === "user"
              ? ("You" as const)
              : interview.interviewers_info?.name ||
                ("AI Interviewer" as const),
          text: message.content,
          time: message.created_at
            ? new Date(message.created_at).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : "",
          audio_url: message.audio_url || "",
        };
      });

      setTranscript(formattedTranscript);
    }
  }, [conversation]);

  const handleTabChange = (value: string) => {
    setLocalActiveTab(value);
    if (setActiveTab) {
      setActiveTab(value);
    }
  };

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  return (
    <div className="hidden lg:block border-l border-gray-200/50 bg-white/80 backdrop-blur-xl overflow-hidden transition-all duration-300 w-full max-w-[20rem]">
      <div className="flex flex-col h-full w-full">
        <Tabs
          value={localActiveTab}
          onValueChange={handleTabChange}
          className="flex flex-col h-full w-full"
        >
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="transcript">Conversation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="details"
            className="flex-1 overflow-auto px-6 pb-6"
          >
            <div className="mb-8">
              <h3 className="font-medium text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
                Interview Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Position</span>
                    <span className="font-medium text-gray-900">
                      {interview.job_role || "Full Stack Developer"}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Interview Type
                    </span>
                    <span className="font-medium text-gray-900">
                      {interview.type || "Technical + Behavioral"}
                    </span>
                  </div>
                </div>
                {hasStarted && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-teal-700">Duration</span>
                      <span className="font-medium text-teal-900">
                        {formatTime(elapsedTime)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                {!hasStarted && (
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white border-0 shadow-lg transform transition-all duration-500 hover:scale-105"
                    variant={"big"}
                    onClick={handleStartRecording}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Interview
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="transcript"
            className="flex-1 overflow-auto px-6 pb-6"
          >
            <h3 className="font-medium text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Live Transcript
            </h3>

            <div className="space-y-6">
              {transcript.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {entry.speaker !== "You" ? (
                        <div className="p-1 rounded-lg bg-teal-100">
                          <Brain className="h-4 w-4 text-teal-600" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-lg bg-gray-100">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      <span className="font-medium text-sm text-gray-900">
                        {entry.speaker}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{entry.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {entry.text}
                  </p>
                </div>
              ))}
              <div className="" ref={transcriptEndRef} />

              {transcript.length === 0 && (
                <div className="text-center py-12">
                  <div className="relative mx-auto w-16 h-16">
                    <Brain className="w-16 h-16 text-gray-300" />
                    <div className="absolute inset-0 animate-ping bg-gray-400/20 rounded-full" />
                  </div>
                  <p className="text-gray-500 mt-4">
                    {hasStarted
                      ? "No transcript available yet"
                      : "Transcript will appear here once the interview starts"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
