import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, MessageSquare, Clock, Code2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Metric {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface PerformanceMetricsProps {
  metrics: {
    technical_accuracy: number;
    communication: number;
    pacing: number;
    keyword_usage: number;
  };
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const metricsData: Metric[] = [
    {
      label: "Technical Accuracy",
      value: metrics.technical_accuracy,
      icon: Brain,
      color: "purple",
    },
    {
      label: "Communication",
      value: metrics.communication,
      icon: MessageSquare,
      color: "blue",
    },
    {
      label: "Pacing",
      value: metrics.pacing,
      icon: Clock,
      color: "green",
    },
    {
      label: "Keyword Usage",
      value: metrics.keyword_usage,
      icon: Code2,
      color: "teal",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metricsData.map((metric) => (
        <Card
          key={metric.label}
          className="group hover:shadow-lg transition-all duration-200 border-0 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-2xl bg-${metric.color}-500/20 text-${metric.color}-400 group-hover:scale-110 transition-transform`}
              >
                <metric.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-white">
                {metric.value}%
              </span>
            </div>
            <h3 className="font-medium text-gray-300 mb-3">{metric.label}</h3>
            <Progress
              value={metric.value}
              className={`h-1.5 bg-gray-700 [--progress-background:theme(colors.${metric.color}.500)]`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
