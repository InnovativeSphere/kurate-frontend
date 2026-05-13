// components/TechLoader.tsx
"use client";

import { useThemeColors } from "../hooks/useThemeColors";

export function TechLoader({ text = "Loading gadgets…" }: { text?: string }) {
  const { accent, textSecondary, bgSubtle } = useThemeColors();

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-20"
      style={{ background: bgSubtle }}
    >
      {/* Pulsing ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="w-20 h-20 rounded-full animate-spin-slow"
          style={{
            border: `2px solid transparent`,
            borderTopColor: accent,
            borderRightColor: accent,
            opacity: 0.8,
          }}
        />
        {/* Middle ring – opposite direction */}
        <div
          className="absolute w-14 h-14 rounded-full animate-spin-slow-reverse"
          style={{
            border: `2px solid transparent`,
            borderBottomColor: accent,
            borderLeftColor: accent,
            opacity: 0.6,
          }}
        />
        {/* Inner dot */}
        <div
          className="absolute w-3 h-3 rounded-full animate-pulse-glow"
          style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
        />
      </div>

      {/* Text */}
      <p
        className="text-sm font-medium tracking-wider animate-pulse-text"
        style={{ color: textSecondary }}
      >
        {text}
      </p>

      {/* Animation definitions */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(0.8); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 2.5s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.8s ease-in-out infinite;
        }
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}