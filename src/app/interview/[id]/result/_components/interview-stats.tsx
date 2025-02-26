import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InterviewStatsProps {
  overallScore: number;
  completedAt: string | undefined;
}

export function InterviewStats({
  overallScore,
  completedAt,
}: InterviewStatsProps) {
  return (
    <Card className="border-0 bg-white dark:bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Interview Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-sky-50 dark:bg-sky-500/20 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-500/30 transition-colors">
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {overallScore}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overall Score
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {completedAt ? new Date(completedAt).toLocaleDateString() : "N/A"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completion Date
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
