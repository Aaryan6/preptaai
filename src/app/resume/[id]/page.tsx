import { getResumeAnalysis } from "@/actions/resume";
import {
  ActionableSuggestions,
  AchievementsSection,
  CategoryScores,
  DesignFeedback,
  KeywordsSection,
  OverallScore,
} from "../_components";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TParams = Promise<{ id: string }>;

export default async function ResumePage({ params }: { params: TParams }) {
  const { id } = await params;
  const resumeAnalysis = await getResumeAnalysis(id);

  if (!resumeAnalysis) {
    return <div>Resume analysis not found</div>;
  }

  // Transform categories object to array format
  const categoryScores = Object.entries(resumeAnalysis.categories).map(
    ([name, score]) => ({
      name,
      score,
    })
  );

  // Split keywords into found and missing (assuming all keywords are found for now)
  const foundKeywords = resumeAnalysis.feedback.keywords;
  const missingKeywords: string[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center sticky top-0 z-50">
        <Link href={`/dashboard`}>
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
            Resume Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {resumeAnalysis.file_name}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 text-gray-600">
          <FileText className="h-5 w-5" />
          <span className="px-2 py-1 text-xs font-medium bg-white rounded-full uppercase">
            {resumeAnalysis.doc_type}
          </span>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-7xl mx-auto space-y-8 px-4">
          <div className="space-y-6">
            <OverallScore score={resumeAnalysis.metrics.overall_score} />

            <CategoryScores categories={categoryScores} />

            <KeywordsSection
              foundKeywords={foundKeywords}
              missingKeywords={missingKeywords}
            />

            <AchievementsSection
              achievements={resumeAnalysis.feedback.achievements}
              improvements={resumeAnalysis.feedback.actionable_suggestions}
            />

            <DesignFeedback
              feedback={resumeAnalysis.feedback.design_feedback.join("\n")}
            />

            <ActionableSuggestions
              suggestions={resumeAnalysis.feedback.actionable_suggestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
