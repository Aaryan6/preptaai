"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface AudioControlsProps {
  onSpeechRecognized: (text: string) => void;
}

export default function AudioControls({
  onSpeechRecognized,
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

          recognition.continuous = false;
          recognition.interimResults = true;

          let finalTranscript = "";

          recognition.onresult = (event: any) => {
            let interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript = transcript;
                console.log("Final transcript:", finalTranscript);
                onSpeechRecognized(`User: ${finalTranscript}`);
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
  }, [onSpeechRecognized, isListening]);

  const handleVoiceInput = async (transcript: string) => {
    console.log({ transcript });
    try {
      setIsProcessing(true);
      stopCurrentAudio();

      abortControllerRef.current = new AbortController();

      const response = await fetch(`/api/voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: transcript }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get audio stream");
      }

      // Get TTFB metrics from headers
      const playHTTTFB = response.headers.get("X-PlayHT-TTFB");
      const chatGptTTFB = response.headers.get("X-ChatGPT-TTFB");
      if (playHTTTFB && chatGptTTFB) {
        console.log(
          `ChatGPT TTFB: ${chatGptTTFB}ms, PlayHT TTFB: ${playHTTTFB}ms`
        );
      }

      if (audioRef.current) {
        // Create a Blob URL from the streaming response
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        audioRef.current.src = url;
        audioRef.current.onended = () => {
          URL.revokeObjectURL(url); // Clean up the Blob URL
        };

        await audioRef.current.play();
        onSpeechRecognized(`AI: Response to "${transcript}"`);
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
    <div className="flex justify-center space-x-4">
      <Button
        onClick={toggleMic}
        variant={isListening ? "default" : "secondary"}
        disabled={isProcessing}
      >
        {isListening ? (
          <Mic className="mr-2 h-4 w-4" />
        ) : (
          <MicOff className="mr-2 h-4 w-4" />
        )}
        {isListening ? "Stop" : "Start"} {isProcessing && "(Processing...)"}
      </Button>
      <audio ref={audioRef} className="hidden" />
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
