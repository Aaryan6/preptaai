"use client";

import { PlayCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Interview } from "@/lib/types";

interface InterviewSidebarProps {
  interview: Interview;
  hasStarted: boolean;
  handleStartRecording: () => void;
}

export default function InterviewSidebar({
  interview,
  hasStarted,
  handleStartRecording,
}: InterviewSidebarProps) {
  return (
    <div className="hidden xl:block border-l border-gray-200/50 bg-white/80 backdrop-blur-xl overflow-hidden transition-all duration-300 w-80">
      <div className="flex flex-col h-full p-6 w-80">
        <div className="mb-8">
          <h3 className="font-medium text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            Interview Details
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Position</span>
                <span className="font-medium text-gray-900">
                  {interview.job_role || "Full Stack Developer"}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Interview Type</span>
                <span className="font-medium text-gray-900">
                  {interview.type || "Technical + Behavioral"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          {!hasStarted && (
            <Button
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 shadow-lg transform transition-all duration-500 hover:scale-105"
              variant={"big"}
              onClick={handleStartRecording}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
