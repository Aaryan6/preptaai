import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ArrowUp } from "lucide-react";

interface Category {
  name: string;
  score: number;
  previousScore?: number;
}

interface CategoryScoresProps {
  categories: Category[];
}

export function CategoryScores({ categories }: CategoryScoresProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const improvement = category.previousScore
          ? (
              ((category.score - category.previousScore) /
                category.previousScore) *
              100
            ).toFixed(1)
          : null;

        return (
          <Card
            key={category.name}
            className="group relative overflow-hidden border-0 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent dark:from-sky-500/10" />
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-600 dark:text-gray-400">
                    {category.name}
                  </h3>
                  {improvement && (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      <ArrowUp className="h-3 w-3" />
                      {improvement}%
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CircularProgress
                      value={category.score}
                      size={60}
                      strokeWidth={6}
                      primaryColor="var(--primary-color, #0EA5E9)"
                      secondaryColor="var(--secondary-color, #F3F4F6)"
                    />
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {category.score}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Current Score
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
