import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Message } from "ai";
import { ArrowLeft, Mic } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Interview } from "@/lib/types";
import { interviewers } from "@/lib/interviews";

interface ConversationSidebarProps {
  conversation: Message[];
  onStartRecording?: () => void;
  isRecording?: boolean;
  isProcessing?: boolean;
  interview: Interview;
}

export default function ConversationSidebar({
  conversation,
  onStartRecording,
  isRecording,
  isProcessing,
  interview,
}: ConversationSidebarProps) {
  const getInterviewerName = (id: string | undefined) => {
    const interviewer = interviewers.find(
      (interviewer) => interviewer.id === id
    );
    return interviewer?.name || "Emily";
  };
  return (
    <div className="max-w-[300px] flex flex-col w-full bg-card text-card-foreground p-4 py-2 border-r border-border">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Conversation</h2>
        <Link
          href={"/"}
          className={cn(
            buttonVariants({
              variant: "secondary",
            }),
            "text-sm px-2 flex items-center gap-1 border hover:border-foreground/60 transition-all duration-150"
          )}
        >
          <ArrowLeft className="size-2" />
          Back
        </Link>
      </div>
      <ScrollArea className="h-full">
        {conversation.length === 0 ? (
          <Card className="border-dashed animate-in fade-in-50 duration-300 ease-in-out shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-100 transition-opacity" />
            <CardHeader>
              <CardTitle className="text-base">Start Your Interview</CardTitle>
              <CardDescription>
                Ready to begin your practice session?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center space-y-3">
                <Button
                  onClick={onStartRecording}
                  disabled={isProcessing}
                  variant="ghost"
                  size="lg"
                  className={`
                    group relative size-12 rounded-full p-0 
                    transition-all duration-200 ease-in-out
                    hover:bg-foreground/70 hover:text-white border-2
                    hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]
                    ${
                      isRecording
                        ? "bg-foreground/80 text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.7)]"
                        : "bg-background dark:bg-slate-900"
                    }
                    ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <Mic className="size-5" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  Click the microphone button and say &quot;Hello&quot; to start
                  the interview
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          conversation.map((text, index) => {
            const isUser = text.role === "user";
            return (
              <div
                key={index}
                className={`mb-4 p-2 rounded-lg ${
                  isUser ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <p className="text-xs font-medium mb-1 bg-background border-2 text-foreground p-1 px-2 rounded-sm w-fit">
                  {isUser ? "You" : getInterviewerName(interview?.voice_id)}
                </p>
                <p className="text-sm whitespace-pre-wrap">{text.content}</p>
              </div>
            );
          })
        )}
      </ScrollArea>
    </div>
  );
}
