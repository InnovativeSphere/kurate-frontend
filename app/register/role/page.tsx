// app/register/role/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/app/lib/theme';
import { Store, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Theme & scroll hooks (same as login/register)
// ─────────────────────────────────────────────────────────────
function useThemeColors() {
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
  };
}

function useInView(threshold = 0.15, triggerOnce = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) obs.disconnect();
        } else if (!triggerOnce) setInView(false);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, triggerOnce]);
  return { ref, inView };
}

// ─────────────────────────────────────────────────────────────
// Animated Card (with accentColor prop)
// ─────────────────────────────────────────────────────────────
function AnimatedCard({
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

export default function RoleSelectionPage() {
  const router = useRouter();
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } = useThemeColors();
  const { ref: headerRef, inView: headerInView } = useInView(0.2);
  const { ref: cardsRef, inView: cardsInView } = useInView(0.1);

  const handleSelectRole = (role: 'buyer' | 'seller') => {
    router.push(`/register?role=${role}`);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center py-16 overflow-hidden" style={{ background: bgSubtle }}>
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1"
          style={{
            position: 'absolute',
            width: 'clamp(300px, 40vw, 500px)',
            height: 'clamp(300px, 40vw, 500px)',
            borderRadius: '50%',
            background: accent,
            opacity: 0.08,
            filter: 'blur(80px)',
            top: '-15%',
            left: '-10%',
            animation: 'floatOrb1 25s ease-in-out infinite',
          }}
        />
        <div
          className="orb-2"
          style={{
            position: 'absolute',
            width: 'clamp(250px, 35vw, 450px)',
            height: 'clamp(250px, 35vw, 450px)',
            borderRadius: '50%',
            background: accent,
            opacity: 0.06,
            filter: 'blur(70px)',
            bottom: '-10%',
            right: '-5%',
            animation: 'floatOrb2 30s ease-in-out infinite',
            animationDelay: '-5s',
          }}
        />
      </div>

      <div className="container max-w-4xl relative z-10 px-4 sm:px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 transition-all duration-700"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-subtle mb-4">
            <Sparkles size={32} className="text-primary" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: textPrimary }}>
            Join Kurate
          </h1>
          <p className="text-sm mt-2" style={{ color: textSecondary }}>
            Choose how you want to use the platform
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700"
          style={{ opacity: cardsInView ? 1 : 0, transform: cardsInView ? 'translateY(0)' : 'translateY(30px)' }}
        >
          {/* Buyer Card */}
          <div onClick={() => handleSelectRole('buyer')} className="cursor-pointer">
            <AnimatedCard accentColor={accent}>
              <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-primary-subtle mx-auto flex items-center justify-center">
                  <ShoppingBag size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>I'm a Buyer</h2>
                <p className="text-sm" style={{ color: textSecondary }}>
                  Discover premium gadgets, compare prices, and connect directly with trusted sellers.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-medium transition-all group" style={{ color: accent }}>
                  Continue as Buyer <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Seller Card */}
          <div onClick={() => handleSelectRole('seller')} className="cursor-pointer">
            <AnimatedCard accentColor={accent}>
              <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-primary-subtle mx-auto flex items-center justify-center">
                  <Store size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>I'm a Seller</h2>
                <p className="text-sm" style={{ color: textSecondary }}>
                  List your products, reach genuine buyers, and grow your business with Kurate.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-medium transition-all group" style={{ color: accent }}>
                  Continue as Seller <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Already have an account? */}
        <div className="text-center mt-10">
          <p className="text-xs" style={{ color: textMuted }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium transition-all hover:underline" style={{ color: accent }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Moving gradient line */}
        <div className="relative w-full h-px overflow-hidden mt-12">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      <style jsx>{`
        .moving-gradient-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #4f9eff, #7b5fff, #c4b5fd, #7b5fff, #4f9eff, transparent);
          background-size: 200% 100%;
          animation: flowGradient 3s linear infinite;
          opacity: 0.6;
        }
        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.98); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 25px) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line { animation: none; }
          .orb-1, .orb-2 { animation: none; }
        }
      `}</style>
    </main>
  );
}