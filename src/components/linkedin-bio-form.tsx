"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function LinkedInBioForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // TODO: Implement LinkedIn bio generation logic
    setIsGenerating(false);
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Generated LinkedIn Bio</label>
          <Textarea
            placeholder="Your professional LinkedIn bio will appear here..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate LinkedIn Bio"}
        </Button>
      </form>
    </Card>
  );
}
