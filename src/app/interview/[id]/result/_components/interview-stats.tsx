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
    <Card className="border-0 bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          Interview Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
            <div className="text-2xl font-bold text-purple-400">
              {overallScore}%
            </div>
            <div className="text-sm text-gray-400">Overall Score</div>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">
            <div className="text-2xl font-bold text-blue-400">
              {completedAt ? new Date(completedAt).toLocaleDateString() : "N/A"}
            </div>
            <div className="text-sm text-gray-400">Completion Date</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
