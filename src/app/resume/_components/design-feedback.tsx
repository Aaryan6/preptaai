import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush } from "lucide-react";

interface DesignFeedbackProps {
  feedback: string;
}

export function DesignFeedback({ feedback }: DesignFeedbackProps) {
  return (
    <Card className="border-0 bg-white dark:bg-gray-800/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Design Feedback
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300">{feedback}</p>
      </CardContent>
    </Card>
  );
}
