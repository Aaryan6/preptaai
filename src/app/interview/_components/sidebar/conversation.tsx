import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Message } from "ai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ConversationSidebarProps {
  conversation: Message[];
}

export default function ConversationSidebar({
  conversation,
}: ConversationSidebarProps) {
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
        {conversation.map((text, index) => {
          const isUser = text.role === "user";
          return (
            <div
              key={index}
              className={`mb-4 p-2 rounded-lg ${
                isUser ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <p className="text-xs font-medium mb-1 bg-background border-2 text-foreground p-1 px-2 rounded-sm w-fit">
                {isUser ? "You" : "Emily"}
              </p>
              <p className="text-sm whitespace-pre-wrap">{text.content}</p>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
