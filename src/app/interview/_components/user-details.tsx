"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { useState } from "react";

interface UserDetailsProps {
  onSubmit: (details: {
    name: string;
    jobRole: string;
    skills?: string;
    experience?: string;
  }) => void;
  onBack: () => void;
  initialData?: {
    name: string;
    jobRole: string;
    skills?: string;
    experience?: string;
  };
  username?: string;
}

export default function UserDetails({
  onSubmit,
  onBack,
  initialData,
}: UserDetailsProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    jobRole: initialData?.jobRole || "",
    skills: initialData?.skills || "",
    experience: initialData?.experience || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    // Only validate required fields (name and jobRole)
    if (formData.name.trim() && formData.jobRole.trim()) {
      onSubmit({
        name: formData.name,
        jobRole: formData.jobRole,
        // Only include optional fields if they have content
        ...(formData.skills.trim() && { skills: formData.skills }),
        ...(formData.experience.trim() && { experience: formData.experience }),
      });
    }
    setIsLoading(false);
  };

  // Only check required fields for form validation
  const isFormValid = formData.name.trim() && formData.jobRole.trim();

  return (
    <div className="w-full max-w-2xl space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        Tell us about yourself
      </h1>
      <p className="text-muted-foreground">
        Please provide your details to personalize your interview experience.
      </p>
      <div className="space-y-4 pt-4">
        <Card className="p-4 bg-background/70">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="p-6 px-4 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobRole" className="text-muted-foreground">
                Job Role *
              </Label>
              <Input
                id="jobRole"
                placeholder="Software Engineer"
                value={formData.jobRole}
                onChange={(e) =>
                  setFormData({ ...formData, jobRole: e.target.value })
                }
                required
                className="p-6 px-4 bg-muted"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="skills" className="text-muted-foreground">
                Key Skills (Optional)
              </Label>
              <Input
                id="skills"
                placeholder="React, Node.js, TypeScript"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="p-6 px-4 bg-muted"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="experience" className="text-muted-foreground">
                Years of Experience (Optional)
              </Label>
              <Input
                id="experience"
                placeholder="2 years"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="p-6 px-4 bg-muted"
              />
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
        <Button disabled={!isFormValid || isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span>Continue</span>
              <Loader className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
