import { create } from "zustand";
import { RefObject } from "react";

interface VideoState {
  isVideoOn: boolean;
  stream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement> | null;
  toggleVideo: () => Promise<void>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  isVideoOn: false,
  stream: null,
  videoRef: null,
  toggleVideo: async () => {
    const { isVideoOn, stream, videoRef } = get();

    if (isVideoOn) {
      // Turn off video
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      set({ isVideoOn: false, stream: null });
    } else {
      try {
        // Turn on video
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        set({ isVideoOn: true, stream: newStream });

        // Set the stream to the video element
        if (videoRef && videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  },
}));
