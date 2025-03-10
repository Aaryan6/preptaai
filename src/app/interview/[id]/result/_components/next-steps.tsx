import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Calendar, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  text: string;
  color: string;
}

export function NextSteps() {
  const steps: Step[] = [
    {
      icon: ClipboardCheck,
      text: "Review feedback details",
      color: "green",
    },
    {
      icon: Calendar,
      text: "Schedule follow-up meeting",
      color: "sky",
    },
    {
      icon: Target,
      text: "Complete assessment form",
      color: "blue",
    },
  ];

  return (
    <Card className="border-0 bg-card/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div
                className={`h-10 w-10 rounded-full bg-${step.color}-500/20 flex items-center justify-center text-${step.color}-600 dark:text-${step.color}-400`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-foreground">{step.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
