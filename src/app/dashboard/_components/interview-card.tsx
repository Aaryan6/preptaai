"use client";

import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface InterviewCardProps {
  title: string;
  type: "technical" | "behavioral";
  status: "completed" | "in-progress";
  date: string;
  duration: string;
  id: string;
}

export function InterviewCard({
  title,
  type,
  status,
  date,
  duration,
  id,
}: InterviewCardProps) {
  const cardStyles = {
    technical: {
      background:
        "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-950/50",
      border: "border-blue-200 dark:border-blue-900",
      hover: "hover:border-blue-300 dark:hover:border-blue-800",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100",
    },
    behavioral: {
      background:
        "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50",
      border: "border-purple-200 dark:border-purple-900",
      hover: "hover:border-purple-300 dark:hover:border-purple-800",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100",
    },
  };

  const styles = cardStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card
        className={`transition-all duration-300 ${styles.background} ${styles.border} ${styles.hover} hover:shadow-lg hover:-translate-y-1`}
      >
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold tracking-tight">{title}</h3>
            <Badge
              variant={status === "completed" ? "default" : "secondary"}
              className="capitalize"
            >
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`capitalize border-0 ${styles.badge}`}
            >
              {type}
            </Badge>
            <motion.div whileHover={{ x: 5 }} className="text-muted-foreground">
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </div>
          <Link
            href={`/interview/${id}`}
            className="absolute inset-0 z-10"
            aria-label={`View details for ${title}`}
          >
            <span className="sr-only">View details</span>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
