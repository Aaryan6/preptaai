"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Akash",
    jobRole: "Software Engineer",
    experience: "5 years",
    skills: "React, Node.js, AWS",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/start-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      router.push("/interview");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md bg-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Information</CardTitle>
          <CardDescription className="text-muted-foreground">
            Please provide your details below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-background"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobRole">Job Role</Label>
              <Input
                id="jobRole"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                className="bg-background"
                placeholder="Enter your job role"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="bg-background"
                placeholder="Enter your skills (comma separated)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="bg-background"
                placeholder="Describe your experience"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
