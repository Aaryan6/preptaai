"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
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

  const handleSubmit = () => {
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
  };

  // Only check required fields for form validation
  const isFormValid = formData.name.trim() && formData.jobRole.trim();

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Tell us about yourself
      </h1>
      <p className="text-muted-foreground">
        Please provide your details to personalize your interview experience.
        Only name and job role are required.
      </p>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobRole">Job Role *</Label>
              <Input
                id="jobRole"
                placeholder="Software Engineer"
                value={formData.jobRole}
                onChange={(e) =>
                  setFormData({ ...formData, jobRole: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills (Optional)</Label>
              <Input
                id="skills"
                placeholder="React, Node.js, TypeScript"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience (Optional)</Label>
              <Input
                id="experience"
                placeholder="2 years"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!isFormValid} onClick={handleSubmit}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
