"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResumeAnalysisProps {
  analysis: {
    overall_score: number;
    categories: {
      ats: number;
      content: number;
      design: number;
      job_match: number;
    };
    keyword_matches: {
      found: string[];
      missing: string[];
    };
    achievements_analysis: {
      good: string[];
      needs_improvement: string[];
    };
    design_feedback: string[];
    top_3_strengths: string[];
    top_3_weaknesses: string[];
    suggestions: string[];
  };
}

export default function ResumeAnalysisResults({
  analysis,
}: ResumeAnalysisProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      {/* Overall Score */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Overall Score</h2>
        <div className="flex items-center gap-4">
          <Progress value={analysis.overall_score} className="flex-1" />
          <span className="text-xl font-semibold">
            {analysis.overall_score}%
          </span>
        </div>
      </Card>

      {/* Category Scores */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Category Scores</h2>
        <div className="space-y-4">
          {Object.entries(analysis.categories).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between">
                <span className="capitalize">{category.replace("_", " ")}</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} />
            </div>
          ))}
        </div>
      </Card>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Found Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.keyword_matches.found.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Missing Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.keyword_matches.missing.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Achievements Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-green-600">
            Strong Achievements
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {analysis.achievements_analysis.good.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-amber-600">
            Areas for Improvement
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {analysis.achievements_analysis.needs_improvement.map(
              (achievement, index) => (
                <li key={index}>{achievement}</li>
              )
            )}
          </ul>
        </Card>
      </div>

      {/* Design Feedback */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Design Feedback</h2>
        <ul className="list-disc pl-5 space-y-2">
          {analysis.design_feedback.map((feedback, index) => (
            <li key={index}>{feedback}</li>
          ))}
        </ul>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-green-600">
            Top Strengths
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {analysis.top_3_strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            Areas to Address
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {analysis.top_3_weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Actionable Suggestions</h2>
        <ul className="list-disc pl-5 space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
