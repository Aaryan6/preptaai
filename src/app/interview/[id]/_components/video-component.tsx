"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useVideoStore } from "@/lib/stores/video-store";
import { useEffect, useRef } from "react";

export default function VideoComponent() {
  const { isVideoOn, stream } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    useVideoStore.setState({ videoRef });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Card className="rounded-none border-none flex-1 flex flex-col h-full">
      <CardContent className="p-0 w-full h-full overflow-hidden flex">
        {isVideoOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Camera is off</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
