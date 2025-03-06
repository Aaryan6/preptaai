"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin, Upload, Zap } from "lucide-react";
import { useState } from "react";

interface BioObject {
  headline: string;
  bio: string;
}

export default function LinkedInBioForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bios, setBios] = useState<BioObject[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numberOfBios, setNumberOfBios] = useState<number>(3);
  const [customPrompt, setCustomPrompt] = useState(``);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

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
    <div className="min-h-screen bg-dots-pattern relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-40 left-20 hidden lg:block">
        <div className="bg-white rounded-xl shadow-lg p-4 rotate-[-10deg] w-64">
          <div className="flex items-center gap-2 mb-2">
            <Linkedin className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-medium">Professional Bio</span>
          </div>
          <div className="text-xs text-gray-600">
            AI-optimized for maximum impact
          </div>
        </div>
      </div>

      <div className="absolute top-[30rem] right-20 hidden lg:block z-0">
        <div className="bg-white rounded-xl shadow-lg p-4 rotate-[5deg] w-64">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-medium">Multiple Versions</span>
          </div>
          <div className="text-xs text-gray-600">
            Choose from various professional styles
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-teal-100 text-teal-800 rounded-full px-4 py-2 text-sm font-medium mb-6 flex items-center"
          >
            <div className="bg-teal-500 rounded-full h-2 w-2 mr-2"></div>
            New! AI-powered LinkedIn bio generation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
          >
            Generate LinkedIn Bio
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl"
          >
            Transform your resume into compelling LinkedIn bios. Multiple
            versions, one click.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto relative z-10 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Upload Resume (PDF)
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 transition-colors duration-200 ${
                  isDragging
                    ? "border-teal-500 bg-teal-50"
                    : file
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300 hover:border-teal-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  {file ? (
                    <>
                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="mt-2 border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          <label
                            htmlFor="resume"
                            className="text-teal-600 hover:underline cursor-pointer"
                          >
                            Upload a file
                          </label>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF files only
                        </p>
                      </div>
                      <input
                        type="file"
                        id="resume"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        size="sm"
                        onClick={() =>
                          document.getElementById("resume")?.click()
                        }
                        className="mt-2 border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Number of Bios to Generate
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Slider
                    value={[numberOfBios]}
                    onValueChange={(value) => setNumberOfBios(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 min-w-[20px]">
                  {numberOfBios}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Customize Generation Prompt (Optional)
              </label>
              <Textarea
                placeholder="Customize how you want your bio to be generated..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full py-6 text-base font-medium rounded-lg bg-teal-500 hover:bg-teal-600 transition-all duration-200"
                disabled={isGenerating || !file}
              >
                {isGenerating ? "Generating..." : "Generate LinkedIn Bio"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </motion.div>

        {bios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 py-12 text-center">
              Generated LinkedIn Bios
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bios.map((bio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="h-full"
                >
                  <Card className="bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 hover:border-teal-100 rounded-xl h-full flex flex-col">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-white pb-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Bio {index + 1}
                        </CardTitle>
                        <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center">
                          <Linkedin className="h-3.5 w-3.5 text-teal-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 flex flex-col h-full gap-2">
                      <div className="space-y-5 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-teal-600">
                            Headline
                          </h3>
                          <p className="text-sm text-gray-900 font-medium leading-relaxed">
                            {bio.headline}
                          </p>
                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className="text-sm font-medium text-teal-600">
                            Bio
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {bio.bio}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-teal-200 text-teal-700 hover:bg-teal-50 flex-1"
                          onClick={() =>
                            navigator.clipboard.writeText(bio.headline)
                          }
                        >
                          Copy Headline
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-teal-200 text-teal-700 hover:bg-teal-50 flex-1"
                          onClick={() => navigator.clipboard.writeText(bio.bio)}
                        >
                          Copy Bio
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
