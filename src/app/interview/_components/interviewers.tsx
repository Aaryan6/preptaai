"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InterviewersInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Plus, Volume2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface InterviewersProps {
  onSelect: (interviewerId: string) => void;
  onBack: () => void;
  selectedInterviewer: string | null;
  interviewers: InterviewersInfo[];
}

export default function Interviewers({
  onSelect,
  onBack,
  selectedInterviewer: initialSelectedInterviewer = null,
  interviewers,
}: InterviewersProps) {
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(
    initialSelectedInterviewer
  );
  const [showMoreOptionsDialog, setShowMoreOptionsDialog] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Show only the first 2 interviewers in the main view
  const mainInterviewers = interviewers.slice(0, 2);
  // The rest will go in the dialog
  const moreInterviewers = interviewers.slice(2);

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
    voiceUrl: string | undefined,
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

  const InterviewerCard = ({
    interviewer,
  }: {
    interviewer: InterviewersInfo;
  }) => (
    <Card
      key={interviewer.id}
      className={`group relative bg-background overflow-hidden p-4 transition-colors border-2 hover:border-primary cursor-pointer ${
        selectedInterviewer === interviewer.id ? "border-2 border-primary" : ""
      }`}
      role="button"
      tabIndex={0}
      onClick={() => handleCardClick(interviewer.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {interviewer.avatar && (
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={interviewer.avatar}
                alt={interviewer.name}
                fill
                className="object-cover"
              />
            </div>
          )}
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
        </div>
        {interviewer.id !== "custom" && interviewer.voice_url && (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full",
              currentlyPlaying === interviewer.id &&
                "bg-primary text-primary-foreground"
            )}
            onClick={(e) =>
              playVoiceSample(e, interviewer.voice_url, interviewer.id)
            }
          >
            <Volume2 className="h-4 w-4" />
            <span className="sr-only">Play voice sample</span>
          </Button>
        )}
      </div>
    </Card>
  );

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
        {mainInterviewers.map((interviewer) => (
          <InterviewerCard key={interviewer.id} interviewer={interviewer} />
        ))}

        {/* Show More Card that looks like an interviewer card */}
        <Card
          className="group relative bg-background overflow-hidden p-4 transition-colors border-2 hover:border-primary cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => setShowMoreOptionsDialog(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">See more interviewers</h3>
                <p className="text-sm text-muted-foreground">
                  Explore additional options
                </p>
              </div>
            </div>
          </div>
        </Card>
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
            <DialogTitle>More Interviewers</DialogTitle>
            <DialogDescription>
              Choose from additional interviewer options
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Only show interviewers not already displayed in the main list */}
            {moreInterviewers.map((interviewer) => (
              <Card
                key={interviewer.id}
                className={`group relative bg-background overflow-hidden p-4 transition-colors border-2 hover:border-primary cursor-pointer ${
                  selectedInterviewer === interviewer.id
                    ? "border-2 border-primary"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedInterviewer(interviewer.id);
                  setShowMoreOptionsDialog(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {interviewer.avatar && (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={interviewer.avatar}
                          alt={interviewer.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="font-semibold group-hover:text-primary">
                        {interviewer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground group-hover:text-primary">
                        {interviewer.behavior}
                      </p>
                    </div>
                  </div>
                  {interviewer.voice_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full",
                        currentlyPlaying === interviewer.id &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={(e) =>
                        playVoiceSample(
                          e,
                          interviewer.voice_url,
                          interviewer.id
                        )
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
