import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KeywordsSectionProps {
  foundKeywords: string[];
  missingKeywords: string[];
}

export function KeywordsSection({
  foundKeywords,
  missingKeywords,
}: KeywordsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-0 bg-white dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Found Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {foundKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Missing Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
