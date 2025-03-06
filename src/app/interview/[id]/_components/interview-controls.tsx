"use client";

import { forwardRef, useState, useRef, useImperativeHandle } from "react";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  MessageSquare,
  Maximize2,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatMessages, Interview } from "@/lib/types";
import { generateId } from "ai";
import { useVideoStore } from "@/lib/stores/video-store";

interface InterviewControlsProps {
  addToConversation: (message: ChatMessages) => Promise<void>;
  conversation: ChatMessages[];
  interview: Interview;
  onRecordingStateChange: (state: boolean) => void;
  onProcessingStateChange: (state: boolean) => void;
  onUserSpeakingChange: (state: boolean) => void;
  setShowTranscript: (show: boolean) => void;
  showTranscript: boolean;
  isMicEnabled: boolean;
  toggleMic: () => void;
}

const InterviewControls = forwardRef<
  { toggleRecording: () => void },
  InterviewControlsProps
>(
  (
    {
      addToConversation,
      conversation,
      interview,
      onRecordingStateChange,
      onProcessingStateChange,
      onUserSpeakingChange,
      setShowTranscript,
      showTranscript,
      isMicEnabled,
      toggleMic,
    },
    ref
  ) => {
    const { isVideoOn, toggleVideo } = useVideoStore();
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useImperativeHandle(ref, () => ({
      toggleRecording: () => {
        if (isRecording) {
          stopCurrentAudio();
        } else {
          startRecording();
        }
      },
    }));

    const stopCurrentAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        onRecordingStateChange(false);
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
        onRecordingStateChange(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to use voice features");
      }
    };

    const handleAudioSubmission = async (audioBlob: Blob) => {
      setIsProcessing(true);
      onProcessingStateChange(true);
      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");
        formData.append("messages", JSON.stringify(conversation));

        formData.append("jobRole", interview.job_role);
        formData.append("skills", interview.skills || "");
        formData.append("experience", interview.experience || "");
        formData.append("type", interview.type || "technical");
        formData.append(
          "voiceId",
          interview.interviewers_info?.voice_id || "aura-orpheus-en"
        );
        formData.append("resumeText", interview?.resume_text || "");
        formData.append(
          "interviewerName",
          interview.interviewers_info?.name || ""
        );
        formData.append("interviewId", interview.id);

        const response = await fetch("/api/interview/chat", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to process audio");
        }

        const data = await response.json();

        if (data.transcribedText) {
          await addToConversation({
            id: generateId(),
            role: "user",
            content: data.transcribedText,
            interview_id: interview.id,
          });
        }

        if (data.aiText) {
          await addToConversation({
            id: generateId(),
            role: "assistant",
            content: data.aiText,
            interview_id: interview.id,
          });
        }

        if (data.audio) {
          let audioUrl;
          if (data.audio.startsWith("http") || data.audio.startsWith("data:")) {
            audioUrl = data.audio;
          } else {
            const mimeType = "audio/wav";
            audioUrl = `data:${mimeType};base64,${data.audio}`;
          }

          const audioResponse = await fetch(audioUrl);
          const audioBlob = await audioResponse.blob();

          const objectUrl = URL.createObjectURL(audioBlob);

          if (audioRef.current) {
            audioRef.current.src = objectUrl;
            audioRef.current.onended = () => {
              URL.revokeObjectURL(objectUrl);
            };
            await audioRef.current.play();
          }
        }
      } catch (error) {
        console.error("Error processing audio:", error);
      } finally {
        setIsProcessing(false);
        onProcessingStateChange(false);
      }
    };

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    return (
      <div className="mt-6 flex items-center justify-center gap-4">
        <audio ref={audioRef} className="hidden" />

        {/* Mic button without visualizer */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full h-12 w-12 transition-all duration-300 ${
                  isMicEnabled
                    ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white border-0 shadow-lg hover:from-teal-700 hover:to-teal-600"
                    : "bg-white text-gray-700 border-gray-200/50 shadow-sm hover:bg-gray-50"
                }`}
                onClick={toggleMic}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <Square className="h-5 w-5" />
                ) : isMicEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMicEnabled ? "Mute microphone" : "Unmute microphone"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full h-12 w-12 transition-all duration-300 ${
                  isVideoOn
                    ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white border-0 shadow-lg hover:from-teal-700 hover:to-teal-600"
                    : "bg-white text-gray-700 border-gray-200/50 shadow-sm hover:bg-gray-50"
                }`}
                onClick={toggleVideo}
              >
                {isVideoOn ? (
                  <Camera className="h-5 w-5" />
                ) : (
                  <CameraOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isVideoOn ? "Turn off camera" : "Turn on camera"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full h-12 w-12 transition-all duration-300 ${
                  showTranscript
                    ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white border-0 shadow-lg hover:from-teal-700 hover:to-teal-600"
                    : "bg-white text-gray-700 border-gray-200/50 shadow-sm hover:bg-gray-50"
                }`}
                onClick={() => {
                  setShowTranscript(!showTranscript);
                  // Show transcript tab is expected to be handled in the parent component
                }}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{"Show transcript"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 bg-white text-gray-700 border-gray-200/50 shadow-sm hover:bg-gray-50"
                onClick={toggleFullScreen}
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Full screen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

InterviewControls.displayName = "InterviewControls";

export default InterviewControls;

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
