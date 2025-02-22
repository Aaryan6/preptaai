import { create } from "zustand";
import { type StateCreator } from "zustand";

type VideoStore = {
  isVideoOn: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null> | null;
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;
  toggleVideo: () => Promise<void>;
};

export const useVideoStore = create<VideoStore>(
  (set, get): VideoStore => ({
    isVideoOn: false,
    videoRef: null,
    stream: null,
    setStream: (stream: MediaStream | null) => set({ stream }),
    toggleVideo: async () => {
      const { isVideoOn, stream } = get();

      // Turn off video
      if (isVideoOn) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        set({ isVideoOn: false, stream: null });
        return;
      }

      // Turn on video
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        set({ isVideoOn: true, stream: newStream });
      } catch (err) {
        console.error("Error accessing the webcam", err);
      }
    },
  })
);
