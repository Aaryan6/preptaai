"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { generateId, Message } from "ai";

interface AudioControlsProps {
  addToConversation: (message: Message) => void;
  conversation: Message[];
  voiceId: string;
}

export default function AudioControls({
  addToConversation,
  conversation,
  voiceId,
}: AudioControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        alert("Speech recognition is not supported in this browser");
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();

          recognition.continuous = true;
          recognition.interimResults = true;

          let finalTranscript = "";

          recognition.onresult = (event: any) => {
            let interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript = transcript;
                handleVoiceInput(finalTranscript);
                finalTranscript = "";
              } else {
                interimTranscript += transcript;
              }
            }
          };

          recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
          };

          recognition.onend = () => {
            if (isListening) {
              recognition.start();
            } else {
              setIsListening(false);
            }
          };

          window.recognition = recognition;
        })
        .catch((err) => {
          console.error("Microphone permission denied:", err);
          alert("Please allow microphone access to use voice features");
        });
    }
  }, [addToConversation, isListening]);

  const handleVoiceInput = async (transcript: string) => {
    const userMessage = {
      id: generateId(),
      role: "user",
      content: transcript,
    };
    try {
      setIsProcessing(true);
      stopCurrentAudio();

      abortControllerRef.current = new AbortController();

      const chatResponse = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...conversation, userMessage] }),
        signal: abortControllerRef.current.signal,
      });

      addToConversation(userMessage as Message);

      const chatData = await chatResponse.json();
      const textResponse = chatData.text;

      // Add the text response to the conversation
      if (textResponse) {
        addToConversation({
          id: generateId(),
          role: "assistant",
          content: textResponse,
        } as Message);
      }

      const response = await fetch(`/api/voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textResponse, voiceId }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get audio stream");
      }

      if (audioRef.current) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        audioRef.current.src = url;
        audioRef.current.onended = () => {
          URL.revokeObjectURL(url);
        };

        await audioRef.current.play();
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sending voice input:", error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      window.recognition?.stop();
      stopCurrentAudio();
    } else {
      window.recognition?.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="flex justify-center">
      <audio ref={audioRef} className="hidden" />
      <Button
        onClick={toggleMic}
        variant={isListening ? "default" : "outline"}
        size="icon"
        disabled={isProcessing}
        className={isListening ? "bg-primary/10" : ""}
      >
        {isListening ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </Button>
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
