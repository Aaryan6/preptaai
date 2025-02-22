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
        relative w-16 h-16 rounded-full p-0 
        transition-all duration-200 ease-in-out
        hover:bg-slate-100 dark:hover:bg-slate-800
        ${isVideoOn ? "bg-blue-500/10" : "bg-slate-50 dark:bg-slate-900"}
      `}
    >
      <div
        className={`
        absolute inset-0 rounded-full
        ${isVideoOn ? "animate-pulse bg-blue-500/30" : ""}
      `}
      />
      {isVideoOn ? (
        <Video className="w-5 h-5 text-blue-500 relative z-10" />
      ) : (
        <VideoOff className="w-5 h-5 relative z-10 text-slate-700 dark:text-slate-300" />
      )}
    </Button>
  );
}
