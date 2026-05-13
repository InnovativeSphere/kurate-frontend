// components/ui/ThemeSwitcher.tsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Paintbrush } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const themes = ['light', 'dark', 'lattie'] as const;
type Theme = (typeof themes)[number];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder button with the same dimensions
    return (
      <button
        className="h-9 w-9 rounded-lg border border-border bg-surface"
        aria-label="Loading theme switcher"
        disabled
      />
    );
  }

  const cycleTheme = () => {
    const current = (theme ?? 'light') as Theme;
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const icon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      case 'lattie':
        return <Paintbrush size={18} />;
      default:
        return <Sun size={18} />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={clsx(
        'h-9 w-9 rounded-lg',
        'flex items-center justify-center',
        'border border-border',
        'bg-surface hover:bg-surface-hover',
        'text-text-secondary hover:text-text-primary',
        'transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-primary'
      )}
      aria-label={`Switch theme (current: ${theme})`}
    >
      {icon(theme as Theme)}
    </button>
  );
}