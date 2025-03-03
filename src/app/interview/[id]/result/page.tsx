"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewResult() {
  const params = useParams();
  const interviewId = params.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading result data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl">Loading interview results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            Full Stack Developer Position
          </p>
        </div>

        <div className="ml-auto">
          <Button
            variant="outline"
            className="border-gray-200/50 text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Overall score */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Overall Performance
            </h2>
            <div className="flex items-center bg-teal-50 px-4 py-2 rounded-full">
              <Star className="text-yellow-500 h-5 w-5 mr-2" />
              <span className="font-bold text-teal-700">85/100</span>
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
                    style={{ width: "88%" }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  88%
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
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  92%
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
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  78%
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
                    style={{ width: "82%" }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 ml-4">
                  82%
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
              <li className="flex">
                <Trophy className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                <p className="text-gray-700">
                  Strong technical knowledge of React and front-end frameworks
                </p>
              </li>
              <li className="flex">
                <Trophy className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                <p className="text-gray-700">
                  Excellent communication skills with clear explanations
                </p>
              </li>
              <li className="flex">
                <Trophy className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                <p className="text-gray-700">
                  Good problem-solving approach with systematic troubleshooting
                </p>
              </li>
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
              <li className="flex">
                <LightbulbIcon className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
                <p className="text-gray-700">
                  Consider providing more specific examples from past projects
                </p>
              </li>
              <li className="flex">
                <LightbulbIcon className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
                <p className="text-gray-700">
                  Try to speak a bit more slowly during technical explanations
                </p>
              </li>
              <li className="flex">
                <LightbulbIcon className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
                <p className="text-gray-700">
                  Expand knowledge of backend technologies like databases
                </p>
              </li>
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
            <div className="p-4 border border-teal-100 rounded-lg bg-teal-50">
              <h3 className="font-medium text-teal-800 mb-2">
                Practice Backend Technologies
              </h3>
              <p className="text-gray-700">
                Focus on strengthening your knowledge of database design and
                server architecture.
              </p>
            </div>

            <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
              <h3 className="font-medium text-purple-800 mb-2">
                Prepare Specific Project Examples
              </h3>
              <p className="text-gray-700">
                Develop concise stories about your past projects focusing on
                your contributions and challenges overcome.
              </p>
            </div>

            <div className="p-4 border border-green-100 rounded-lg bg-green-50">
              <h3 className="font-medium text-green-800 mb-2">
                Mock Interview Practice
              </h3>
              <p className="text-gray-700">
                Schedule more practice interviews focusing specifically on
                pacing and technical depth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
