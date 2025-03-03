"use client";

import { InterviewersInfo } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import InterviewerAvatar from "@/app/interview/[id]/_components/interviewer-avatar";

interface InterviewerBadgeProps {
  interviewer: InterviewersInfo | undefined;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md";
  showStatus?: boolean;
  isActive?: boolean;
}

export default function InterviewerBadge({
  interviewer,
  variant = "default",
  size = "md",
  showStatus = false,
  isActive = false,
}: InterviewerBadgeProps) {
  const avatarSize = size === "sm" ? "sm" : "md";
  const padding = size === "sm" ? "p-1" : "p-2";
  const baseClasses = "flex items-center gap-2 rounded-full";

  // Set variant styles
  const variantClasses = {
    default: "bg-black/20 backdrop-blur-md border border-white/10 text-white",
    secondary:
      "bg-teal-500/10 backdrop-blur-md border border-teal-500/20 text-teal-300",
    outline: "bg-transparent border border-gray-200/30 text-gray-200",
  }[variant];

  return (
    <div className={`${baseClasses} ${variantClasses} ${padding}`}>
      <div className="flex-shrink-0">
        <InterviewerAvatar
          interviewer={interviewer}
          size={avatarSize}
          className="scale-75"
        />
      </div>

      <div className="flex flex-col">
        <span
          className={`${size === "sm" ? "text-xs" : "text-sm"} font-medium`}
        >
          {interviewer?.name || "AI Interviewer"}
        </span>

        {showStatus && (
          <div className="flex items-center gap-1">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-xs opacity-75">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
