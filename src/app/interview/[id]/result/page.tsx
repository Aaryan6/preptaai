import { getInterview } from "@/actions/interview";
import { InterviewResult } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import {
  CongratsCard,
  DetailedFeedback,
  InterviewStats,
  NextSteps,
  PerformanceMetrics,
} from "./_components";
import GenerateResult from "./_components/generate-result";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

async function getInterviewResult(
  interviewId: string
): Promise<InterviewResult | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interview_results")
    .select("*")
    .eq("interview_id", interviewId)
    .single();

  if (error?.code === "PGRST116") {
    // No result found
    return null;
  }

  if (error) {
    console.error("Error fetching interview result:", error);
    throw new Error("Failed to fetch interview result");
  }

  return data as InterviewResult;
}

export default async function InterviewResultPage({
  params,
}: {
  params: { id: string };
}) {
  const interview = await getInterview(params.id);
  const result = await getInterviewResult(params.id);

  if (!result) {
    return (
      <div className="h-full bg-muted flex items-center justify-center">
        <div className="max-w-lg w-full p-6 md:p-12 bg-card rounded-2xl shadow-lg flex flex-col items-center">
          <Image
            src="/result.svg"
            alt="Interview Result"
            width={300}
            height={200}
            className="mx-auto"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Generated Your Result
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            The results for this interview haven&apos;t been generated yet.
            Click below to generate them.
          </p>
          <GenerateResult interviewId={params.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-muted overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Link
          href={"/dashboard"}
          className={cn(
            buttonVariants({ variant: "default" }),
            "text-sm bg-background hover:bg-background/80 text-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft className="size-2" />
          Back to Dashboard
        </Link>
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Congratulations Card */}
            <CongratsCard type={interview.type} jobRole={interview.job_role} />

            {/* Performance Metrics */}
            <PerformanceMetrics metrics={result.metrics} />
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Interview Stats */}
            <InterviewStats
              overallScore={result.metrics.overall_score}
              completedAt={interview.created_at}
            />

            {/* Next Steps */}
            <NextSteps />
          </div>
        </div>

        {/* Detailed Feedback - Full Width */}
        <DetailedFeedback feedback={result.feedback} />
      </div>
    </div>
  );
}
