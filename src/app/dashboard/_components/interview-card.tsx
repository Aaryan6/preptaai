"use client";

import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
        "bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-950/50 dark:to-teal-900/50",
      border: "border-teal-200 dark:border-teal-900",
      hover: "hover:border-teal-300 dark:hover:border-teal-800",
      badge: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-100",
      button: "bg-teal-500 text-white",
    },
    behavioral: {
      background:
        "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50",
      border: "border-purple-200 dark:border-purple-900",
      hover: "hover:border-purple-300 dark:hover:border-purple-800",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100",
      button: "bg-purple-500/70 text-white",
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
          <div className="flex items-end justify-between">
            <Badge
              variant="outline"
              className={`capitalize border-0 ${styles.badge}`}
            >
              {type}
            </Badge>
            <Link
              href={
                status === "completed"
                  ? `/interview/${id}/result`
                  : `/interview/${id}`
              }
              className=""
              aria-label={`View details for ${title}`}
            >
              <motion.div
                whileHover={{ x: 5 }}
                className={cn(
                  "text-muted-foreground bg-background p-4 rounded-full",
                  styles.button
                )}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
