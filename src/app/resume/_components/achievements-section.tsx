import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AchievementsSectionProps {
  achievements: string[];
  improvements: string[];
}

export function AchievementsSection({
  achievements,
  improvements,
}: AchievementsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-0 bg-white dark:bg-gray-800/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Strong Achievements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {achievements.map((achievement, index) => (
              <li
                key={index}
                className="bg-green-50 dark:bg-green-900/10 text-gray-700 dark:text-gray-300 p-3 rounded-lg text-sm"
              >
                {achievement}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white dark:bg-gray-800/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Areas for Improvement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {improvements.map((improvement, index) => (
              <li
                key={index}
                className="bg-red-50 dark:bg-red-900/10 text-gray-700 dark:text-gray-300 p-3 rounded-lg text-sm"
              >
                {improvement}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
