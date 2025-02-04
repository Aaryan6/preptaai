"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, VideoOff } from "lucide-react";

export default function VideoComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((videoStream) => {
          stream = videoStream;
          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
          }
        })
        .catch((err) => console.error("Error accessing the webcam", err));
    }

    // Cleanup function to stop all tracks when component unmounts or video is toggled off
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isVideoOn]);

  const toggleVideo = () => {
    // First stop any existing tracks
    const currentStream = videoRef.current?.srcObject as MediaStream;
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      videoRef.current!.srcObject = null;
    }
    setIsVideoOn(!isVideoOn);
  };

  return (
    <Card className="mb-4 bg-card text-card-foreground h-full">
      <CardContent className="p-0 relative h-full">
        {isVideoOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Camera is off</p>
          </div>
        )}
        <Button
          onClick={toggleVideo}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-background"
        >
          {isVideoOn ? (
            <VideoOff className="h-4 w-4" />
          ) : (
            <Video className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
