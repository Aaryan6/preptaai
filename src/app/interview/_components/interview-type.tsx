"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

type InterviewType = "behavioral" | "technical" | null;

interface InterviewTypeProps {
  onSelect: (type: Exclude<InterviewType, null>) => void;
  onBack: () => void;
  selectedType?: InterviewType;
}

export default function InterviewType({
  onSelect,
  onBack,
  selectedType: initialType = null,
}: InterviewTypeProps) {
  const [selectedType, setSelectedType] = useState<InterviewType>(initialType);

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Select a question type
      </h1>
      <p className="text-muted-foreground">
        We have hundreds of questions from top tech companies. Choose a type to
        get started.
      </p>
      <div className="space-y-4">
        {interviewTypes.map((type) => (
          <Card
            key={type.type}
            className={`group relative bg-background overflow-hidden p-4 transition-colors border-2 hover:border-primary cursor-pointer ${
              selectedType === type.type ? "border-2 border-primary" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedType(type.type as InterviewType)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3
                  className={cn(
                    "font-semibold group-hover:text-primary transition-colors",
                    selectedType === type.type
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {type.title}
                </h3>
                <p
                  className={cn(
                    "text-sm text-muted-foreground group-hover:text-primary transition-colors",
                    selectedType === type.type
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {type.description}
                </p>
              </div>
              <Badge variant="secondary">{type.difficulty}</Badge>
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
          Back to home
        </Button>
        <Button disabled={!selectedType} onClick={handleContinue}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

const interviewTypes = [
  {
    type: "behavioral",
    title: "Behavioral",
    description: "From LinkedIn, Amazon, Adobe",
    difficulty: "Easy",
  },
  {
    type: "technical",
    title: "Technical",
    description: "From Google, Meta, and Apple",
    difficulty: "Medium",
  },
];
