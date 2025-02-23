import * as React from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 6,
  primaryColor = "var(--primary-color, #8B5CF6)",
  secondaryColor = "var(--secondary-color, #E5E7EB)",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="transition-all duration-300"
          stroke={secondaryColor}
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-300"
          stroke={primaryColor}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
    </div>
  );
}
