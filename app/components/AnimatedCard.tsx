'use client';

import { useState } from 'react';
import { useThemeColors } from '../hooks/useThemeColors';

export function AnimatedCard({
  children,
  className = '',
  accentColor,
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  const { isDark, isLattie, accent: defaultAccent, border, bgSurface } = useThemeColors();
  const finalAccent = accentColor || defaultAccent;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative rounded-2xl transition-all duration-500 ${className}`}
      style={{
        background: bgSurface,
        border: `1px solid ${hovered ? finalAccent + '60' : border}`,
        backdropFilter: 'blur(16px)',
        boxShadow: hovered
          ? `0 20px 40px -12px ${finalAccent}40`
          : isDark
          ? '0 2px 12px rgba(0,0,0,0.35)'
          : '0 2px 12px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${finalAccent}, ${finalAccent}, transparent)`,
            backgroundSize: '200% 100%',
            animation: 'slideBorder 1.5s linear infinite',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '2px',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        @keyframes slideBorder {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-border { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}