"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateResult({
  interviewId,
}: {
  interviewId: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerateResult = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/interview/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh the page to show the results
      router.refresh();
    } catch (error) {
      console.error("Error generating result:", error);
      alert("Failed to generate interview result. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleGenerateResult}
      disabled={isGenerating}
    >
      {isGenerating ? "Generating Results..." : "Generate Results"}
    </Button>
  );
}
