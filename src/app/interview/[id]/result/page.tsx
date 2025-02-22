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

async function getInterviewResult(
  interviewId: string
): Promise<InterviewResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interview_results")
    .select("*")
    .eq("interview_id", interviewId)
    .single();

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Congratulations Card */}
            <CongratsCard type={interview.type} jobRole={interview.job_role} />

            {/* Performance Metrics */}
            <PerformanceMetrics metrics={result.metrics} />

            {/* Detailed Feedback */}
            <DetailedFeedback feedback={result.feedback} />
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Interview Stats */}
            <InterviewStats
              overallScore={result.metrics.overall_score}
              completedAt={interview.completed_at}
            />

            {/* Next Steps */}
            <NextSteps />
          </div>
        </div>
      </div>
    </div>
  );
}
