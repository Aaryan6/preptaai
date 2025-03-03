import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CongratsCardProps {
  type: string | undefined;
  jobRole: string | undefined;
}

export function CongratsCard({ type, jobRole }: CongratsCardProps) {
  return (
    <Card className="bg-gradient-to-r from-teal-500/20 to-teal-400/10 dark:from-teal-500/20 dark:to-teal-400/20 border-0 overflow-hidden relative group">
      <CardContent className="flex items-center justify-between p-8 relative">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">
            Congratulations! 🎉
          </h2>
          <p className="text-muted-foreground">
            You&apos;ve completed your {type} interview for the {jobRole}{" "}
            position.
          </p>
          {/* <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2 group">
            Download Report
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button> */}
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="h-32 w-32 relative z-10 bg-gradient-to-br from-teal-500/30 to-teal-400/30 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
