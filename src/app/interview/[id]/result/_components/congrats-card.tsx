import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CongratsCardProps {
  type: string | undefined;
  jobRole: string | undefined;
}

export function CongratsCard({ type, jobRole }: CongratsCardProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-0 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="flex items-center justify-between p-8 relative">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white">Congratulations! 🎉</h2>
          <p className="text-gray-400">
            You&apos;ve completed your {type} interview for the {jobRole}{" "}
            position.
          </p>
          <button className="bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-600 transition-all duration-200 flex items-center gap-2 group">
            Download Report
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="h-32 w-32 relative z-10 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
