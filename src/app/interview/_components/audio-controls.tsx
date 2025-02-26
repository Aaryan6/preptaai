"use client";

import { Button } from "@/components/ui/button";
import AudioVisualizer from "@/components/user-voice-visualizer";
import { Interview } from "@/lib/types";
import { generateId, Message } from "ai";
import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";

interface AudioControlsProps {
  addToConversation: (message: Message) => Promise<void>;
  conversation: Message[];
  interview: Interview;
}

export default function AudioControls({
  addToConversation,
  conversation,
  interview,
}: AudioControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setMediaStream(null);
    }
  };

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setMediaStream(mediaStream);
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await handleAudioSubmission(audioBlob);
        mediaStream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to use voice features");
    }
  };

  const handleAudioSubmission = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      formData.append("messages", JSON.stringify(conversation));

      // Add interview settings with fallback values for optional fields
      formData.append("jobRole", interview.job_role);
      formData.append("skills", interview.skills || "");
      formData.append("experience", interview.experience || "");
      formData.append("type", interview.type || "technical");
      formData.append("voiceId", interview.voice_id || "aura-orpheus-en");

      const response = await fetch("/api/interview/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process audio");
      }

      const data = await response.json();

      // Add user's transcribed message to conversation
      if (data.transcribedText) {
        await addToConversation({
          id: generateId(),
          role: "user",
          content: data.transcribedText,
        });
      }

      // Add AI's response to conversation
      if (data.aiText) {
        await addToConversation({
          id: generateId(),
          role: "assistant",
          content: data.aiText,
        });
      }

      // Handle audio response
      if (data.audio) {
        let audioUrl;
        if (data.audio.startsWith("http") || data.audio.startsWith("data:")) {
          audioUrl = data.audio;
        } else {
          const mimeType = "audio/wav";
          audioUrl = `data:${mimeType};base64,${data.audio}`;
        }

        // Convert base64 to blob
        const audioResponse = await fetch(audioUrl);
        const audioBlob = await audioResponse.blob();

        // Create object URL for the blob
        const objectUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = objectUrl;
          audioRef.current.onended = () => {
            URL.revokeObjectURL(objectUrl); // Clean up
          };
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopCurrentAudio();
    } else {
      startRecording();
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-center items-center bg-muted rounded-lg px-4 p-1 gap-2">
        <audio ref={audioRef} className="hidden" />
        <Button
          onClick={toggleRecording}
          disabled={isProcessing}
          variant="ghost"
          size="lg"
          className={`
          group relative size-12 rounded-full p-0 
          transition-all duration-200 ease-in-out
          hover:bg-foreground/70 hover:text-white border-2
          ${
            isRecording
              ? "bg-foreground/80 text-white"
              : "bg-background dark:bg-slate-900"
          }
            ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
          {isRecording ? (
            <Square className="w-5 h-5 relative z-10" />
          ) : (
            <Mic
              className={`
            w-5 h-5 relative z-10 group-hover:text-white
            ${isProcessing ? "text-slate-400" : ""}
          `}
            />
          )}
        </Button>
        <AudioVisualizer stream={mediaStream} />
      </div>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    recognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}
