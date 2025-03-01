"use client";

import { InterviewersInfo } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain } from "lucide-react";
import Image from "next/image";

interface InterviewerAvatarProps {
  interviewer: InterviewersInfo | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  showFallback?: boolean;
  className?: string;
}

export default function InterviewerAvatar({
  interviewer,
  size = "md",
  showFallback = true,
  className = "",
}: InterviewerAvatarProps) {
  // Define sizes for different options
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  const containerSize = sizeMap[size];
  const iconSize = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  }[size];

  if (!interviewer && !showFallback) {
    return null;
  }

  return (
    <>
      {interviewer?.avatar ? (
        <div
          className={`relative ${containerSize} rounded-full overflow-hidden border-4 border-gray-700 shadow-xl ${className}`}
        >
          <Image
            src={interviewer.avatar}
            alt={interviewer.name || "AI Interviewer"}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <Avatar
          className={`${containerSize} bg-gray-800 border-4 border-gray-700 ${className}`}
        >
          <AvatarFallback className="text-4xl text-gray-600">
            <Brain className={iconSize + " text-gray-700"} />
          </AvatarFallback>
        </Avatar>
      )}
    </>
  );
}
