"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { interviewers } from "@/lib/interviews";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

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

  const handleContinue = () => {
    if (selectedInterviewer) {
      onSelect(selectedInterviewer);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">And an interviewer</h1>
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
            onClick={() => setSelectedInterviewer(interviewer.id)}
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
                  {interviewer.role}
                </p>
              </div>
              <Badge variant="secondary">{interviewer.language}</Badge>
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
    </div>
  );
}
