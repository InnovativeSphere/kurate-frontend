// components/providers/ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

const themes = ['light', 'dark', 'lattie'] as const;
export type Theme = (typeof themes)[number];

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={[...themes]}
      defaultTheme={defaultTheme}
      enableSystem={false}
      script={false}          // ✅ stops the <script> injection error
    >
      {children}
    </NextThemesProvider>
  );
}