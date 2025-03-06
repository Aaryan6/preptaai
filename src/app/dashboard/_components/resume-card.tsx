import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { ResumeAnalysis } from "@/lib/types";

interface ResumeCardProps {
  id: string;
  fileName: string;
  docType: string;
  date: string;
  score: number;
}

export function ResumeCard({
  id,
  fileName,
  docType,
  date,
  score,
}: ResumeCardProps) {
  return (
    <Link href={`/resume/${id}`} className="w-full max-w-sm">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500 shrink-0" />
              <h3 className="font-semibold text-base truncate">{fileName}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-gray-100 rounded-full uppercase text-xs">
                {docType}
              </span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-sm font-medium text-gray-600">
              Score: {score}%
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
