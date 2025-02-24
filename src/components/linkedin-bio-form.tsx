"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface BioObject {
  headline: string;
  bio: string;
}

export default function LinkedInBioForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bios, setBios] = useState<BioObject[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [numberOfBios, setNumberOfBios] = useState<number>(3);
  const [customPrompt, setCustomPrompt] = useState(``);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      if (!file) {
        throw new Error("Please upload a PDF resume");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", customPrompt);
      formData.append("numberOfBios", numberOfBios.toString());

      const response = await fetch("/api/generate-bio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate bio");
      }

      const data = await response.json();
      console.log({ data });
      setBios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error generating bio:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      // You might want to show an error message to the user here
      setFile(null);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl">
      <Card className="p-6 max-w-lg w-full mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Resume (PDF)</label>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Number of Bios to Generate
            </label>
            <div className="flex items-center gap-4">
              <Slider
                value={[numberOfBios]}
                onValueChange={(value: number[]) => setNumberOfBios(value[0])}
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-center">{numberOfBios}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Customize Generation Prompt (Optional)
            </label>
            <Textarea
              placeholder="Customize how you want your bio to be generated..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isGenerating || !file}
          >
            {isGenerating ? "Generating..." : "Generate LinkedIn Bio"}
          </Button>
        </form>
      </Card>

      {bios.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Generated LinkedIn Bios</h2>
          {bios.map((bio, index) => (
            <Card key={index} className="w-full max-w-2xl p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Version {index + 1}</h3>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Headline
                    </h4>
                    <p className="text-base font-medium">{bio.headline}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Bio
                    </h4>
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {bio.bio}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
