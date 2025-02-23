import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Target } from "lucide-react";

interface DetailedFeedbackProps {
  feedback: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
}

export function DetailedFeedback({ feedback }: DetailedFeedbackProps) {
  return (
    <Card className="border-0 bg-white dark:bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Detailed Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Strengths */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#DCFCE7] dark:bg-green-900/20">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Strengths
              </h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, i) => (
                <li
                  key={i}
                  className="bg-green-50 dark:bg-green-900/10 text-gray-700 dark:text-gray-300 p-3 rounded-lg text-sm"
                >
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#FEE2E2] dark:bg-red-900/20">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Areas for Improvement
              </h3>
            </div>
            <ul className="space-y-3">
              {feedback.weaknesses.map((weakness, i) => (
                <li
                  key={i}
                  className="bg-red-50 dark:bg-red-900/10 text-gray-700 dark:text-gray-300 p-3 rounded-lg text-sm"
                >
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#E1EFFE] dark:bg-blue-900/20">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Action Items
              </h3>
            </div>
            <ul className="space-y-3">
              {feedback.improvements.map((improvement, i) => (
                <li
                  key={i}
                  className="bg-blue-50 dark:bg-blue-900/10 text-gray-700 dark:text-gray-300 p-3 rounded-lg text-sm"
                >
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
