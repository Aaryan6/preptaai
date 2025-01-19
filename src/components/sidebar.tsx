import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationSidebarProps {
  conversation: string[];
}

export default function ConversationSidebar({
  conversation,
}: ConversationSidebarProps) {
  return (
    <div className="w-64 bg-card text-card-foreground p-4 border-r border-border">
      <h2 className="text-lg font-semibold mb-4">Conversation</h2>
      <ScrollArea className="h-[calc(100vh-100px)]">
        {conversation.map((text, index) => {
          const isUser = text.startsWith("User:");
          return (
            <div
              key={index}
              className={`mb-4 p-2 rounded-lg ${
                isUser ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {isUser ? "You" : "AI Assistant"}
              </p>
              <p className="text-sm">{text.replace(/^(User:|AI:)\s*/, "")}</p>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
