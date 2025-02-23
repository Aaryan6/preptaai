import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";

interface OverallScoreProps {
  score: number;
  previousScore?: number;
}

export function OverallScore({ score, previousScore }: OverallScoreProps) {
  const improvement = previousScore
    ? (((score - previousScore) / previousScore) * 100).toFixed(1)
    : null;

  return (
    <Card className="relative overflow-hidden border-0 bg-white dark:bg-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent dark:from-purple-500/10" />
      <CardContent className="p-8">
        <div className="flex items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Overall Score
            </h2>
            {improvement && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                +{improvement}% from previous
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <CircularProgress
              value={score}
              size={100}
              strokeWidth={8}
              primaryColor="var(--primary-color, #8B5CF6)"
              secondaryColor="var(--secondary-color, #F3F4F6)"
            />
            <div className="space-y-1">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {score}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current Score
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
