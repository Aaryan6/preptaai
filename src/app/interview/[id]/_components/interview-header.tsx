"use client";

import { ChevronLeft, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Interview } from "@/lib/types";
import Link from "next/link";

interface InterviewHeaderProps {
  interview: Interview;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  hasStarted: boolean;
}

export default function InterviewHeader({
  interview,
  elapsedTime,
  formatTime,
  hasStarted,
}: InterviewHeaderProps) {
  return (
    <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              AI Interview Experience
            </h1>
            {hasStarted && (
              <Badge className="bg-red-50/50 text-red-600 border-red-100 animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {interview.job_role || "Interview Position"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white rounded-full border border-gray-200/50 shadow-sm px-4 py-2">
          <Timer className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {formatTime(elapsedTime)}
          </span>
        </div>

        <Button
          variant="outline"
          className="border-gray-200/50 text-gray-700 hover:bg-gray-50 shadow-sm"
          onClick={() =>
            (window.location.href = `/interview/${interview.id}/result`)
          }
        >
          End Session
        </Button>
      </div>
    </header>
  );
}
