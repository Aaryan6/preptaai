"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      className="w-full max-w-sm mx-auto"
      onClick={handleGenerateResult}
      disabled={isGenerating}
      variant="big"
    >
      {isGenerating ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        "Generate Results"
      )}
    </Button>
  );
}
