import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "ai";

interface ConversationSidebarProps {
  conversation: Message[];
}

export default function ConversationSidebar({
  conversation,
}: ConversationSidebarProps) {
  return (
    <div className="w-64 bg-card text-card-foreground p-4 border-r border-border">
      <h2 className="text-lg font-semibold mb-4">Conversation</h2>
      <ScrollArea className="h-[calc(100vh-100px)]">
        {conversation.map((text, index) => {
          const isUser = text.role === "user";
          return (
            <div
              key={index}
              className={`mb-4 p-2 rounded-lg ${
                isUser ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {isUser ? "You" : "Emily"}
              </p>
              <p className="text-sm">{text.content}</p>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
