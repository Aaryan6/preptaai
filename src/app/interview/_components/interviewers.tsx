"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { additionalVoices, interviewers } from "@/lib/interviews";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { useState, useRef } from "react";

interface InterviewersProps {
  onSelect: (interviewerId: string) => void;
  onBack: () => void;
  selectedInterviewer: string | null;
}

export default function Interviewers({
  onSelect,
  onBack,
  selectedInterviewer: initialSelectedInterviewer = null,
}: InterviewersProps) {
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(
    initialSelectedInterviewer
  );
  const [showMoreOptionsDialog, setShowMoreOptionsDialog] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleContinue = () => {
    if (selectedInterviewer) {
      onSelect(selectedInterviewer);
    }
  };

  const handleCardClick = (interviewerId: string) => {
    if (interviewerId === "custom") {
      setShowMoreOptionsDialog(true);
    } else {
      setSelectedInterviewer(interviewerId);
    }
  };

  const playVoiceSample = (
    event: React.MouseEvent,
    voiceUrl: string,
    interviewerId: string
  ) => {
    event.stopPropagation();

    if (!voiceUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      if (currentlyPlaying === interviewerId) {
        setCurrentlyPlaying(null);
        return;
      }
    }

    const audio = new Audio(voiceUrl);
    audio.onended = () => setCurrentlyPlaying(null);
    audio.play();
    audioRef.current = audio;
    setCurrentlyPlaying(interviewerId);
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Choose your interviewer
      </h1>
      <p className="text-muted-foreground">
        Choose whoever makes you feel comfortable. You can always try again with
        another one.
      </p>
      <div className="space-y-4">
        {interviewers.map((interviewer) => (
          <Card
            key={interviewer.id}
            className={`group relative bg-background overflow-hidden p-4 transition-colors border-2 hover:border-primary cursor-pointer ${
              selectedInterviewer === interviewer.id
                ? "border-2 border-primary"
                : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(interviewer.id)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3
                  className={cn(
                    "font-semibold group-hover:text-primary",
                    selectedInterviewer === interviewer.id
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {interviewer.name}
                </h3>
                <p
                  className={cn(
                    "text-sm text-muted-foreground group-hover:text-primary",
                    selectedInterviewer === interviewer.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {interviewer.behavior}
                </p>
              </div>
              {interviewer.id !== "custom" && interviewer.voiceUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full",
                    currentlyPlaying === interviewer.id &&
                      "bg-primary text-primary-foreground"
                  )}
                  onClick={(e) =>
                    playVoiceSample(e, interviewer.voiceUrl, interviewer.id)
                  }
                >
                  <Volume2 className="h-4 w-4" />
                  <span className="sr-only">Play voice sample</span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button disabled={!selectedInterviewer} onClick={handleContinue}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Dialog for more voice options */}
      <Dialog
        open={showMoreOptionsDialog}
        onOpenChange={setShowMoreOptionsDialog}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Interviewer</DialogTitle>
            <DialogDescription>
              Choose from additional interviewer options
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 grid grid-cols-2 gap-4">
            {additionalVoices.map((voice) => (
              <Card
                key={voice.id}
                className={`group relative bg-background overflow-hidden p-4 transition-colors border-2 hover:border-primary cursor-pointer ${
                  selectedInterviewer === voice.id
                    ? "border-2 border-primary"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedInterviewer(voice.id);
                  setShowMoreOptionsDialog(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold group-hover:text-primary">
                      {voice.name}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-primary">
                      {voice.behavior}
                    </p>
                  </div>
                  {voice.voiceUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full",
                        currentlyPlaying === voice.id &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={(e) =>
                        playVoiceSample(e, voice.voiceUrl, voice.id)
                      }
                    >
                      <Volume2 className="h-4 w-4" />
                      <span className="sr-only">Play voice sample</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
