"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
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
        <Card
          className={`relative overflow-hidden p-4 transition-colors hover:bg-accent cursor-pointer ${
            selectedType === "behavioral" ? "border-2 border-primary" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedType("behavioral")}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Behavioral</h3>
              <p className="text-sm text-muted-foreground">
                From LinkedIn, Amazon, Adobe
              </p>
            </div>
            <Badge variant="secondary">Easy</Badge>
          </div>
        </Card>
        <Card
          className={`relative overflow-hidden p-4 transition-colors hover:bg-accent cursor-pointer ${
            selectedType === "technical" ? "border-2 border-primary" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedType("technical")}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Technical</h3>
              <p className="text-sm text-muted-foreground">
                From Google, Meta, and Apple
              </p>
            </div>
            <Badge variant="secondary">Medium</Badge>
          </div>
        </Card>
      </div>
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
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
