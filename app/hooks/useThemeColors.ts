// hooks/useThemeColors.ts
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  const isLattie = mounted && resolvedTheme === 'lattie';
  return {
    isDark,
    isLattie,
    textPrimary: isDark ? '#F0EEFF' : isLattie ? '#1A1814' : '#0D0F1A',
    textSecondary: isDark ? '#A89EC8' : isLattie ? '#5C5851' : '#4B5170',
    textMuted: isDark ? '#6B6088' : isLattie ? '#9C9890' : '#9299B8',
    border: isDark
      ? 'rgba(255,255,255,0.08)'
      : isLattie
      ? 'rgba(0,0,0,0.06)'
      : 'rgba(0,0,0,0.06)',
    accent: isDark ? '#7B5FFF' : isLattie ? '#A0998F' : '#4F9EFF',
    bgSurface: isDark
      ? 'rgba(14,14,24,0.85)'
      : isLattie
      ? 'rgba(250,248,245,0.85)'
      : 'rgba(255,255,255,0.85)',
    bgSubtle: isDark ? '#0F0F1A' : isLattie ? '#F4F2EE' : '#F8F9FF',
    error: '#EF4444',
    success: '#00B86E',
  };
}