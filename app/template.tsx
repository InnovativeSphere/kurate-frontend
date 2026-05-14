'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/lib/theme';

const progressColors = {
  light: 'linear-gradient(90deg, #4F9EFF 0%, #7B5FFF 50%, #C4B5FD 100%)',
  dark:  'linear-gradient(90deg, #7B5FFF 0%, #C4B5FD 50%, #4F9EFF 100%)',
  lattie:'linear-gradient(90deg, #C4B5FD 0%, #7B5FFF 60%, #4F9EFF 100%)',
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [progress, setProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathname = useRef(pathname);
  const progressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTheme = mounted
    ? ((resolvedTheme ?? 'light') as keyof typeof progressColors)
    : 'light';

  const gradientBar = progressColors[currentTheme];
  const glowColor = currentTheme === 'dark' ? '#C4B5FD' : '#7B5FFF';
  const trackBg = currentTheme === 'dark'
    ? 'rgba(123,95,255,0.1)'
    : 'rgba(79,158,255,0.08)';

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    setProgress(0);
    setIsNavigating(true);
    progressTimer.current = setTimeout(() => setProgress(85), 50);
    completeTimer.current = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 400);
    }, 500);

    return () => {
      if (progressTimer.current) clearTimeout(progressTimer.current);
      if (completeTimer.current) clearTimeout(completeTimer.current);
    };
  }, [pathname]);

  return (
    <>
      {/* Progress bar – only shown during navigation */}
      {mounted && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: isNavigating ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: trackBg }} />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progress}%`,
              background: gradientBar,
              borderRadius: '0 2px 2px 0',
              transition:
                progress === 0
                  ? 'none'
                  : progress === 100
                  ? 'width 0.2s ease-out'
                  : 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              left: `calc(${progress}% - 6px)`,
              width: '12px',
              height: '6px',
              borderRadius: '50%',
              background: glowColor,
              filter: 'blur(3px)',
              opacity: progress > 0 && progress < 100 ? 0.9 : 0,
              transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Direct children – no extra wrapper div */}
      {children}
    </>
  );
}