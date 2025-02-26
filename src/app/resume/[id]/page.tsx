import { getResumeAnalysis } from "@/actions/resume";
import {
  ActionableSuggestions,
  AchievementsSection,
  CategoryScores,
  DesignFeedback,
  KeywordsSection,
  OverallScore,
} from "../_components";
import { FileText } from "lucide-react";

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
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resume Analysis</h1>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <FileText className="h-5 w-5" />
          <span>{resumeAnalysis.file_name}</span>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-full uppercase">
            {resumeAnalysis.doc_type}
          </span>
        </div>
      </div>

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
  );
}
