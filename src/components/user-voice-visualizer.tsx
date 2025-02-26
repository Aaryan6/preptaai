"use client";

import { useEffect, useRef } from "react";

export default function AudioVisualizer({
  stream,
}: {
  stream: MediaStream | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    // When stream changes, set up or clean up accordingly
    if (stream) {
      // Set up audio context and analyzer
      const setupAudio = async () => {
        // Close previous audio context if it exists
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // Start visualization
        drawVisualizer();
      };

      setupAudio();
    } else {
      // If stream is null, draw static dots
      drawStaticDots();
    }

    // Cleanup function when component unmounts or stream changes
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stream]);

  // Draw static dots when no audio is playing
  const drawStaticDots = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "black";

    // Calculate spacing same as in active visualization
    const dotSize = 2;
    const spacing = 5;
    const totalWidth = dotSize + spacing;

    // We'll draw half the number of dots on each side of center
    const dotsPerSide = 20;

    // Center points
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;

    // Draw dots from center going outward
    for (let i = 0; i < dotsPerSide; i++) {
      // Calculate positions for dots on both sides of center
      const gapFromCenter = i * totalWidth + spacing / 2;

      // Left side dot
      const leftX = centerX - gapFromCenter - dotSize;
      // Draw left dot at the center line
      ctx.fillRect(leftX, centerY - dotSize / 2, dotSize, dotSize);

      // Right side dot
      const rightX = centerX + gapFromCenter;
      // Draw right dot at the center line
      ctx.fillRect(rightX, centerY - dotSize / 2, dotSize, dotSize);
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    // Use frequency data for vertical bars
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "black";

    // Calculate bar width and spacing
    const barWidth = 2;
    const spacing = 5;
    const totalBarWidth = barWidth + spacing;

    // We'll draw half the number of bars on each side of center
    const barsPerSide = 20;

    // Center point (horizontal) of canvas
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;

    // Draw bars from center going outward
    for (let i = 0; i < barsPerSide; i++) {
      // Get data from lower frequencies for positions closer to center
      // and higher frequencies for positions further from center
      const dataIndex = Math.floor(
        (i / barsPerSide) * dataArrayRef.current.length
      );
      const value = dataArrayRef.current[dataIndex];

      // Calculate bar height based on audio data (max height is 40px)
      const barHeight = Math.max(2, (value / 255) * 40);
      const halfHeight = barHeight / 2;

      // Calculate x positions for bars on both sides of center
      // First gap is half the spacing
      const gapFromCenter = i * totalBarWidth + spacing / 2;

      // Left side bar (going left from center)
      const leftX = centerX - gapFromCenter - barWidth;
      // Draw left bar (extending up and down from centerY)
      ctx.fillRect(leftX, centerY - halfHeight, barWidth, barHeight);

      // Right side bar (going right from center)
      const rightX = centerX + gapFromCenter;
      // Draw right bar (extending up and down from centerY)
      ctx.fillRect(rightX, centerY - halfHeight, barWidth, barHeight);
    }

    animationRef.current = requestAnimationFrame(drawVisualizer);
  };

  return (
    <div className="relative max-w-sm mx-auto">
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className="w-full rounded-lg bg-muted"
      />
    </div>
  );
}
