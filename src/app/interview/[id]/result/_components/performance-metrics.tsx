import { Brain, Clock, Code2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PerformanceMetricsProps {
  metrics: {
    technical_accuracy: number;
    communication: number;
    pacing: number;
    keyword_usage: number;
  };
}

interface Metric {
  label: string;
  value: number;
  icon: any;
  iconBg: string;
  iconColor: string;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const metricsData: Metric[] = [
    {
      label: "Technical Accuracy",
      value: metrics.technical_accuracy,
      icon: Brain,
      iconBg: "bg-[#F3E8FF] dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Communication",
      value: metrics.communication,
      icon: MessageSquare,
      iconBg: "bg-[#E1EFFE] dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Pacing",
      value: metrics.pacing,
      icon: Clock,
      iconBg: "bg-[#DCFCE7] dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Keyword Usage",
      value: metrics.keyword_usage,
      icon: Code2,
      iconBg: "bg-[#CCFBF1] dark:bg-teal-900/20",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {metricsData.map((metric) => (
        <Card
          key={metric.label}
          className="group transition-all duration-200 border-0 bg-white dark:bg-gray-800/50 hover:shadow-lg dark:hover:bg-gray-800/80"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {metric.value}%
              </span>
            </div>
            <h3 className="font-medium text-gray-600 dark:text-gray-300 mb-4">
              {metric.label}
            </h3>
            <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gray-900 dark:bg-white transition-all duration-500 ease-out rounded-full"
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
