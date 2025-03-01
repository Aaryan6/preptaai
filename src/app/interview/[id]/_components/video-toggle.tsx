import { Button } from "@/components/ui/button";
import { Video, VideoOff } from "lucide-react";
import { useVideoStore } from "@/lib/stores/video-store";

export default function VideoToggle() {
  const { isVideoOn, toggleVideo } = useVideoStore();

  return (
    <Button
      onClick={toggleVideo}
      variant="ghost"
      size="lg"
      className={`
        group relative size-12 rounded-full p-0 
        transition-all duration-200 ease-in-out
        hover:bg-foreground/70 hover:text-white border-2
        ${
          isVideoOn
            ? "bg-foreground/80 text-white"
            : "bg-background dark:bg-slate-900"
        }
      `}
    >
      <div
        className={`
        absolute inset-0 rounded-full
        ${isVideoOn ? "animate-pulse bg-foreground/30" : ""}
      `}
      />
      {isVideoOn ? (
        <Video className="w-5 h-5 relative z-10" />
      ) : (
        <VideoOff className="w-5 h-5 relative z-10" />
      )}
    </Button>
  );
}
