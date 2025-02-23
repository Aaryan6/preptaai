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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Interview Results Not Generated
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
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
              completedAt={interview.completed_at}
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
