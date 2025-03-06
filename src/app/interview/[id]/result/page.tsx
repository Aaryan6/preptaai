"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import {
  ArrowLeft,
  Download,
  Star,
  BadgeCheck,
  Clock,
  BrainCircuit,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Trophy,
  LightbulbIcon,
  LineChart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInterviewResult } from "@/actions/interview";
import { getInterview } from "@/actions/interview";
import type { InterviewResult, Interview } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatDuration = (
  startedAt: string | undefined,
  completedAt: string | undefined
) => {
  if (!startedAt || !completedAt) return "0m 0s";

  const start = moment(startedAt);
  const end = moment(completedAt);
  const durationInSeconds = end.diff(start, "seconds");

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
};

export default function InterviewResult() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const interviewData = await getInterview(interviewId);
        setInterview(interviewData);

        try {
          const resultData = await getInterviewResult(interviewId);
          setResult(resultData);
        } catch (err) {
          // No results found is an expected case, not an error
          console.log("No results found for interview");
        }
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError("Failed to load interview. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interviewId]);

  const handleGenerateResults = async () => {
    try {
      setGenerating(true);

      const response = await fetch("/api/interview/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate results");
      }

      const data = await response.json();

      // Refresh the page to show the new results
      router.refresh();

      // Or set the result directly
      setResult(data.result);
      setGenerating(false);
    } catch (err) {
      console.error("Error generating results:", err);
      setError("Failed to generate results. Please try again later.");
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !interview) return;

    try {
      setDownloading(true);

      // Create a temporary wrapper with white background for better PDF rendering
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "-9999px";
      wrapper.style.width = reportRef.current.offsetWidth + "px";
      wrapper.style.background = "white";

      // Clone the report content
      const clone = reportRef.current.cloneNode(true) as HTMLElement;
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // Capture the content as an image
      const canvas = await html2canvas(wrapper, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Remove the temporary wrapper
      document.body.removeChild(wrapper);

      // Create PDF (A4 format)
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // Add content to PDF
      pdf.setFontSize(18);
      pdf.text(`${interview.job_role} Interview Results`, 14, 22);
      pdf.setFontSize(12);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
      pdf.text(
        `Interview Duration: ${formatDuration(
          interview?.started_at,
          interview?.completed_at
        )}`,
        14,
        38
      );
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        45,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Download the PDF
      pdf.save(
        `${interview.job_role.replace(/\s+/g, "_")}_Interview_Results.pdf`
      );
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl">Loading interview results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-xl text-red-500 mb-4">{error}</p>
        <Link href={`/interview/${interviewId}`}>
          <Button variant="outline">Return to Interview</Button>
        </Link>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-xl mb-4">Interview not found.</p>
        <Link href="/dashboard">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!result && !generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center sticky top-0 z-50">
          <Link href={`/interview/${interviewId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Interview Results
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {interview?.job_role || "Interview"} Position
            </p>
          </div>
        </header>

        {/* Generate Results Card */}
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl shadow-lg border-gray-200/70">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                Generate Interview Results
              </CardTitle>
              <CardDescription>
                Your interview is complete! Generate results to get detailed
                feedback on your performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2 flex flex-col items-center">
              <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <LineChart className="h-8 w-8 text-teal-500" />
              </div>
              <div className="text-center max-w-md space-y-2 mb-6">
                <p className="text-gray-700">
                  We&apos;ll analyze your interview and provide:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center justify-center">
                    <BadgeCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Performance metrics on key areas</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                    <span>Strengths and highlights</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <ThumbsDown className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Areas for improvement</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <BrainCircuit className="h-4 w-4 mr-2 text-teal-500" />
                    <span>Actionable next steps</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button
                onClick={handleGenerateResults}
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-2 h-auto"
              >
                Generate Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center sticky top-0 z-50">
          <Link href={`/interview/${interviewId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Interview Results
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {interview?.job_role || "Interview"} Position
            </p>
          </div>
        </header>

        {/* Generating Animation */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-md space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-teal-500 rounded-full mx-auto animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="h-8 w-8 text-teal-500 animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Analyzing Your Interview
              </h2>
              <p className="text-gray-600">
                We&apos;re evaluating your responses, communication skills, and
                technical accuracy to provide comprehensive feedback.
              </p>

              <div className="flex flex-col items-center space-y-2 pt-4">
                <div className="flex space-x-1">
                  <div
                    className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-teal-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  This may take a minute or two
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center sticky top-0 z-50">
        <Link href={`/dashboard`}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Interview Results
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {interview?.job_role || "Interview"} Position
          </p>
        </div>

        <div className="ml-auto">
          <Button
            variant="outline"
            className="border-gray-200/50 text-gray-700 hover:bg-gray-50 shadow-sm"
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Preparing PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Content - Add ref for PDF generation */}
      <div ref={reportRef} className="container max-w-6xl mx-auto py-8 px-4">
        {/* Overall score */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Overall Performance
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <Clock className="text-blue-500 h-5 w-5 mr-2" />
                <span className="font-medium text-blue-700">
                  Duration:{" "}
                  {formatDuration(
                    interview?.started_at,
                    interview?.completed_at
                  )}
                </span>
              </div>
              <div className="flex items-center bg-teal-50 px-4 py-2 rounded-full">
                <Star className="text-yellow-500 h-5 w-5 mr-2" />
                <span className="font-bold text-teal-700">
                  {result!.metrics.overall_score}/100
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200/50">
              <div className="flex items-center mb-2">
                <BrainCircuit className="h-5 w-5 text-teal-500 mr-2" />
                <h3 className="font-medium text-gray-700">
                  Technical Accuracy
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full"
                    style={{ width: `${result!.metrics.technical_accuracy}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  {result!.metrics.technical_accuracy}%
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200/50">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-gray-700">Communication</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${result!.metrics.communication}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  {result!.metrics.communication}%
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200/50">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="font-medium text-gray-700">Pacing</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: `${result!.metrics.pacing}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  {result!.metrics.pacing}%
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200/50">
              <div className="flex items-center mb-2">
                <BadgeCheck className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="font-medium text-gray-700">Keyword Usage</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${result!.metrics.keyword_usage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  {result!.metrics.keyword_usage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Strengths</h2>
            </div>

            <ul className="space-y-4">
              {result!.feedback.strengths.map((strength, index) => (
                <li key={index} className="flex">
                  <Trophy className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <p className="text-gray-700">{strength}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for improvement */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <ThumbsDown className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Areas for Improvement
              </h2>
            </div>

            <ul className="space-y-4">
              {result!.feedback.weaknesses.map((weakness, index) => (
                <li key={index} className="flex">
                  <LightbulbIcon className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
                  <p className="text-gray-700">{weakness}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-teal-100 rounded-lg mr-3">
              <BrainCircuit className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Recommended Next Steps
            </h2>
          </div>

          <div className="space-y-4">
            {result!.feedback.improvements.map((improvement, index) => {
              const colors = [
                {
                  bg: "bg-teal-50",
                  border: "border-teal-100",
                  text: "text-teal-800",
                },
                {
                  bg: "bg-purple-50",
                  border: "border-purple-100",
                  text: "text-purple-800",
                },
                {
                  bg: "bg-green-50",
                  border: "border-green-100",
                  text: "text-green-800",
                },
                {
                  bg: "bg-teal-50",
                  border: "border-teal-100",
                  text: "text-teal-800",
                },
                {
                  bg: "bg-amber-50",
                  border: "border-amber-100",
                  text: "text-amber-800",
                },
              ];
              const color = colors[index % colors.length];

              return (
                <div
                  key={index}
                  className={`p-4 ${color.border} rounded-lg ${color.bg}`}
                >
                  <h3 className={`font-medium ${color.text} mb-2`}>
                    {improvement.split(":")[0]}
                  </h3>
                  <p className="text-gray-700">
                    {improvement.includes(":")
                      ? improvement.split(":")[1].trim()
                      : improvement}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
