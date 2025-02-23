import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

interface ActionableSuggestionsProps {
  suggestions: string[];
}

export function ActionableSuggestions({
  suggestions,
}: ActionableSuggestionsProps) {
  return (
    <Card className="border-0 bg-white dark:bg-gray-800/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Actionable Suggestions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="bg-yellow-50 dark:bg-yellow-900/10 text-gray-700 dark:text-gray-300 p-3 rounded-lg text-sm"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
