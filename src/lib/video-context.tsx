import { createContext, useContext, useEffect, useRef, useState } from "react";

type VideoContextType = {
  isVideoOn: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  toggleVideo: () => void;
};

const VideoContext = createContext<VideoContextType | null>(null);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    const currentStream = videoRef.current?.srcObject as MediaStream;
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      videoRef.current!.srcObject = null;
    }
    setIsVideoOn(!isVideoOn);
  };

  return (
    <VideoContext.Provider value={{ isVideoOn, videoRef, toggleVideo }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}
