import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DetailedFeedbackProps {
  feedback: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
}

export function DetailedFeedback({ feedback }: DetailedFeedbackProps) {
  return (
    <Card className="border-0 bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          Detailed Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Strengths */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-200">Strengths</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              {feedback.strengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-200">
              Areas for Improvement
            </h3>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              {feedback.weaknesses.map((weakness, i) => (
                <li key={i}>{weakness}</li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-200">
              Action Items
            </h3>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              {feedback.improvements.map((improvement, i) => (
                <li key={i}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
