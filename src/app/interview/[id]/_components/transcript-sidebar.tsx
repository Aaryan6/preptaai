"use client";

import { Brain, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "ai";
import { useEffect, useState } from "react";

interface TranscriptEntry {
  id: number;
  speaker: "AI Interviewer" | "You";
  text: string;
  time: string;
}

interface TranscriptSidebarProps {
  conversation: Message[];
  setShowTranscript: (show: boolean) => void;
  formatTime: (seconds: number) => string;
}

export default function TranscriptSidebar({
  conversation,
  setShowTranscript,
  formatTime,
}: TranscriptSidebarProps) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  console.log({ conversation });

  useEffect(() => {
    // Convert conversation to transcript format
    const formattedTranscript = conversation.map((message, index) => {
      // Get the created_at time from the message
      const createdAt = message.createdAt || new Date().toISOString();
      const date = new Date(createdAt);
      const seconds = Math.floor(date.getTime() / 1000);

      return {
        id: index + 1,
        speaker:
          message.role === "user"
            ? ("You" as const)
            : ("AI Interviewer" as const),
        text: message.content,
        time: formatTime(seconds),
      };
    });

    setTranscript(formattedTranscript);
  }, [conversation, formatTime]);

  return (
    <div className="w-96 border-l border-gray-200/50 bg-white/80 backdrop-blur-xl p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Live Transcript
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
          onClick={() => setShowTranscript(false)}
        >
          Close
        </Button>
      </div>

      <div className="space-y-6">
        {transcript.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {entry.speaker === "AI Interviewer" ? (
                  <div className="p-1 rounded-lg bg-blue-100">
                    <Brain className="h-4 w-4 text-blue-600" />
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

        {transcript.length === 0 && (
          <div className="text-center py-12">
            <div className="relative mx-auto w-16 h-16">
              <Brain className="w-16 h-16 text-gray-300" />
              <div className="absolute inset-0 animate-ping bg-gray-400/20 rounded-full" />
            </div>
            <p className="text-gray-500 mt-4">
              Transcript will appear here once the interview starts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
