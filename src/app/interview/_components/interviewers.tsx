"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Interviewer = {
  id: string;
  name: string;
  role: string;
  language: "EN";
};

interface InterviewersProps {
  onSelect: (interviewerId: string) => void;
  onBack: () => void;
  selectedInterviewer: string | null;
}

const interviewers: Interviewer[] = [
  {
    id: "aura-orpheus-en",
    name: "Orpheus",
    role: "Software Engineering",
    language: "EN",
  },

  {
    id: "aura-orion-en",
    name: "Orion",
    role: "Product Management",
    language: "EN",
  },
  {
    id: "aura-luna-en",
    name: "Luna",
    role: "Other",
    language: "EN",
  },
];

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
            className={`relative bg-background overflow-hidden p-4 transition-colors hover:bg-violet-50 cursor-pointer ${
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
                <h3 className="font-semibold text-black">{interviewer.name}</h3>
                <p className="text-sm text-zinc-600">{interviewer.role}</p>
              </div>
              <Badge variant="secondary">{interviewer.language}</Badge>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Previous step
        </Button>
        <Button disabled={!selectedInterviewer} onClick={handleContinue}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
