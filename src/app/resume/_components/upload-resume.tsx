"use client";

import { useState } from "react";
import {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromDOC,
} from "@/utils/file-extractors";
import { Loader2, Upload, Zap, ArrowRight } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { createResumeAnalysis } from "@/actions/resume";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UploadResume() {
  const router = useRouter();
  const { user } = useUser();
  const [jobRole, setJobRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return validTypes.includes(file.type);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      let text: string;
      const fileType = file.name.toLowerCase().split(".").pop();

      switch (fileType) {
        case "pdf":
          text = await extractTextFromPDF(file);
          break;
        case "docx":
          text = await extractTextFromDOCX(file);
          break;
        case "doc":
          text = await extractTextFromDOC(file);
          break;
        default:
          throw new Error(
            "Unsupported file type. Please upload a PDF, DOC, or DOCX file."
          );
      }

      const response = await fetch("/api/resume-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: text,
          jobRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const result = await response.json();

      if (!result || !result.categories) {
        throw new Error("Invalid response format from API");
      }

      // Store the analysis in the database
      const storedAnalysis = await createResumeAnalysis({
        user_id: user?.id || "", // This will be set by the server action
        file_name: file.name,
        doc_type: fileType as "pdf" | "doc" | "docx",
        resume_text: text,
        metrics: {
          content_score: result.categories.content,
          format_score: result.categories.design,
          impact_score: result.categories.job_match,
          overall_score: result.overall_score,
        },
        feedback: {
          achievements: result.achievements_analysis.good,
          keywords: result.keyword_matches.found,
          design_feedback: result.design_feedback,
          actionable_suggestions: result.suggestions,
        },
        categories: result.categories,
      });

      // Redirect to the analysis page
      router.push(`/resume/${storedAnalysis.id}`);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setError(
        error instanceof Error ? error.message : "Failed to analyze resume"
      );
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto p-6">
        <Toaster />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <Toaster />
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="jobRole"
              className="text-sm font-medium text-gray-700"
            >
              Desired Job Role
            </label>
            <Input
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              placeholder="e.g. Software Engineer, Product Manager"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Upload Resume
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
                          htmlFor="file-upload"
                          className="text-teal-600 hover:underline cursor-pointer"
                        >
                          Upload a file
                        </label>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
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

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isLoading || !file || !jobRole}
              className="w-full py-6 text-base font-medium rounded-lg bg-teal-500 hover:bg-teal-600 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
