// components/Hero.tsx
'use client';

import { useTheme } from '@/app/lib/theme';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Sparkles, Zap } from 'lucide-react';

const heroContent = {
  light: {
    badge: 'NEW ARRIVALS THIS WEEK',
    headlineLine1: 'Discover Premium',
    headlineLine2: 'Tech, Brightly.',
    subtitle:
      'Handpicked gadgets from verified local sellers. See full specs, compare instantly, and connect directly — no DMs, no waiting.',
    cta1: 'Browse Gadgets',
    cta2: 'Start Selling',
    stat1: { value: '500+', label: 'Products Listed' },
    stat2: { value: '120+', label: 'Verified Sellers' },
    stat3: { value: '4.9★', label: 'Seller Rating' },
  },
  dark: {
    badge: 'FEATURED DROPS',
    headlineLine1: 'Enter the Premium',
    headlineLine2: 'Tech Realm.',
    subtitle:
      'The marketplace that feels as premium as the products inside it. Curated. Magnetic. Built for people who know what they want.',
    cta1: 'Explore Drops',
    cta2: 'Sell Here',
    stat1: { value: '500+', label: 'Products Listed' },
    stat2: { value: '120+', label: 'Verified Sellers' },
    stat3: { value: '4.9★', label: 'Seller Rating' },
  },
  lattie: {
    badge: 'CURATED FOR YOU',
    headlineLine1: 'Curated Tech,',
    headlineLine2: 'Quietly Refined.',
    subtitle:
      'Thoughtfully selected. Effortlessly yours. Tech shopping in its most mature, considered form — no noise, just the right things.',
    cta1: 'Browse Collection',
    cta2: 'Open a Store',
    stat1: { value: '500+', label: 'Products Listed' },
    stat2: { value: '120+', label: 'Verified Sellers' },
    stat3: { value: '4.9★', label: 'Seller Rating' },
  },
};

const orbConfig = {
  light: {
    color: 'rgba(79, 158, 255, 0.18)',
    glow: '0 0 80px 40px rgba(79, 158, 255, 0.1)',
    colorSecondary: 'rgba(123, 95, 255, 0.12)',
  },
  dark: {
    color: 'rgba(123, 95, 255, 0.35)',
    glow: '0 0 90px 50px rgba(123, 95, 255, 0.2)',
    colorSecondary: 'rgba(79, 158, 255, 0.15)',
  },
  lattie: {
    color: 'rgba(196, 181, 253, 0.12)',
    glow: '0 0 60px 30px rgba(123, 95, 255, 0.06)',
    colorSecondary: 'rgba(196, 181, 253, 0.08)',
  },
};

export function Hero() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentTheme = mounted ? (resolvedTheme ?? theme ?? 'light') : 'light';
  const content = heroContent[currentTheme as keyof typeof heroContent] ?? heroContent.light;
  const orbs = orbConfig[currentTheme as keyof typeof orbConfig] ?? orbConfig.light;

  const isLattie = currentTheme === 'lattie';
  const isDark = currentTheme === 'dark';

  const bgColor = isDark ? '#0A0A0F' : isLattie ? '#F4F2EE' : '#F8F9FF';
  const textPrimary = isDark ? '#F0EEFF' : isLattie ? '#1A1814' : '#0D0F1A';
  const textSecondary = isDark ? '#A89EC8' : isLattie ? '#5C5851' : '#4B5170';
  const textMuted = isDark ? '#6B6088' : isLattie ? '#9C9890' : '#9299B8';
  const borderColor = isDark ? '#1E1A30' : isLattie ? '#D8D4CC' : '#DDE2F4';
  const primaryColor = isDark ? '#7B5FFF' : isLattie ? '#8C8880' : '#4F9EFF';
  const accentColor = isDark ? '#4F9EFF' : isLattie ? '#A0998F' : '#7B5FFF';

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 4rem)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        isolation: 'isolate',
        backgroundColor: bgColor,
      }}
    >
      {/* Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="hero-orb orb-1" style={{ background: orbs.color, boxShadow: orbs.glow }} />
        <div className="hero-orb orb-2" style={{ background: orbs.colorSecondary, boxShadow: orbs.glow }} />
        <div className="hero-orb orb-3" style={{ background: orbs.color, boxShadow: orbs.glow }} />
      </div>

      {/* Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          padding: '4rem 2rem',
        }}
      >
        {/* Responsive flex: column on mobile, row on desktop */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Left column */}
          <div
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
            style={{ flex: '1', maxWidth: '560px', width: '100%' }}
          >
            {/* Badge – centered on mobile, left on desktop */}
            <div
              className="mx-auto lg:mx-0"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                border: `1px solid ${borderColor}`,
                marginBottom: '2rem',
                backgroundColor: isDark
                  ? 'rgba(123,95,255,0.1)'
                  : isLattie
                  ? 'rgba(196,181,253,0.08)'
                  : 'rgba(79,158,255,0.06)',
                borderColor: isDark
                  ? 'rgba(123,95,255,0.2)'
                  : isLattie
                  ? borderColor
                  : 'rgba(79,158,255,0.15)',
              }}
            >
              <Zap size={11} style={{ color: isLattie ? '#C4B5FD' : primaryColor }} />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: isLattie ? textMuted : primaryColor,
                }}
              >
                {content.badge}
              </span>
            </div>

            {/* Headline – centered on mobile */}
            <h1
              style={{
                fontFamily: 'var(--font-syne), system-ui, sans-serif',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ display: 'block', color: textPrimary }}>{content.headlineLine1}</span>
              <span
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {content.headlineLine2}
              </span>
            </h1>

            {/* Subtitle – centered on mobile */}
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: textSecondary,
                maxWidth: '36ch',
                marginBottom: '2rem',
              }}
            >
              {content.subtitle}
            </p>

            {/* Divider – centered on mobile */}
            <div
              className="mx-auto lg:mx-0"
              style={{
                width: '2rem',
                height: '1px',
                background: borderColor,
                opacity: 0.5,
                marginBottom: '2rem',
              }}
            />

            {/* Buttons – centered on mobile */}
            <div className="flex flex-col items-center lg:items-start gap-4 mb-10 lg:mb-12">
              <Link
                href="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                  color: '#fff',
                  boxShadow: '0 2px 12px -2px rgba(123,95,255,0.3)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                <ShoppingBag size={16} />
                {content.cta1}
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/register/role"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: `2px solid ${borderColor}`,
                  color: textPrimary,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.color = textPrimary;
                }}
              >
                <Sparkles size={16} />
                {content.cta2}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Stats – centered on mobile, left on desktop */}
            <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
              {[content.stat1, content.stat2, content.stat3].map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start gap-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-syne), sans-serif',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      lineHeight: 1.2,
                      background: 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      color: textMuted,
                      textTransform: 'uppercase',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
              <div className="hidden lg:block" style={{ width: '1px', height: '2rem', background: borderColor }} />
              <div
                className="flex items-center gap-2 text-xs mt-2 lg:mt-0"
                style={{ color: textMuted }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: '#00B86E',
                    animation: 'pulse 2s infinite',
                  }}
                />
                Live marketplace
              </div>
            </div>
          </div>

          {/* Right column – product card + WhatsApp badge */}
          <div className="flex-shrink-0 w-full max-w-[360px] mt-10 lg:mt-0">
            {/* Main card */}
            <div
              style={{
                background: 'rgba(var(--surface-rgb, 255,255,255), 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
                padding: '1.75rem',
                border: `1px solid ${
                  isDark
                    ? 'rgba(123,95,255,0.15)'
                    : isLattie
                    ? 'rgba(196,181,253,0.15)'
                    : 'rgba(79,158,255,0.1)'
                }`,
                overflow: 'hidden',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              className="group/card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 20px 40px -12px rgba(123,95,255,0.2)'
                  : '0 20px 40px -12px rgba(79,158,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Image area */}
              <div
                style={{
                  borderRadius: '0.75rem',
                  aspectRatio: '4/3',
                  width: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(123,95,255,0.15), rgba(79,158,255,0.08))'
                    : isLattie
                    ? 'linear-gradient(135deg, rgba(196,181,253,0.1), rgba(237,233,227,0.6))'
                    : 'linear-gradient(135deg, rgba(79,158,255,0.1), rgba(123,95,255,0.06))',
                }}
              >
                <ShoppingBag
                  size={40}
                  style={{
                    opacity: 0.2,
                    color: accentColor,
                    transition: 'transform 0.3s',
                  }}
                  className="group-hover/card:scale-110"
                />
              </div>

              {/* Mock product info */}
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ height: '2px', borderRadius: '9999px', width: '75%', background: borderColor }} />
                <div style={{ height: '2px', borderRadius: '9999px', width: '50%', background: borderColor }} />
              </div>

              {/* Price + contact */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.5rem',
                }}
              >
                <div
                  style={{
                    height: '0.75rem',
                    borderRadius: '9999px',
                    width: '4rem',
                    background: 'var(--primary-subtle, rgba(123,95,255,0.2))',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                    color: '#fff',
                  }}
                >
                  <span>Contact</span>
                  <ArrowRight size={10} />
                </div>
              </div>

              {/* Corner glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  right: '-1.5rem',
                  width: '6rem',
                  height: '6rem',
                  borderRadius: '9999px',
                  pointerEvents: 'none',
                  opacity: 0.4,
                  filter: 'blur(24px)',
                  background: isDark ? 'rgba(123,95,255,0.2)' : 'rgba(79,158,255,0.1)',
                }}
              />
            </div>

            {/* Floating WhatsApp badge */}
            <div
              style={{
                marginTop: '1.5rem',
                background: 'rgba(var(--surface-rgb, 255,255,255), 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: `1px solid ${isDark ? 'rgba(123,95,255,0.1)' : borderColor}`,
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                }}
              >
                <Zap size={12} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: textPrimary }}>
                  Direct WhatsApp Contact
                </p>
                <p style={{ fontSize: '0.6875rem', marginTop: '0.125rem', color: textMuted }}>
                  Talk to sellers instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
          pointer-events: none;
        }
        .orb-1 {
          width: clamp(250px, 35vw, 500px);
          height: clamp(250px, 35vw, 500px);
          top: -20%;
          right: -5%;
          animation: float1 22s ease-in-out infinite;
        }
        .orb-2 {
          width: clamp(180px, 25vw, 350px);
          height: clamp(180px, 25vw, 350px);
          bottom: -15%;
          left: -5%;
          animation: float2 28s ease-in-out infinite;
          animation-delay: -8s;
        }
        .orb-3 {
          width: clamp(100px, 14vw, 200px);
          height: clamp(100px, 14vw, 200px);
          top: 55%;
          left: 35%;
          animation: float3 18s ease-in-out infinite;
          animation-delay: -12s;
          opacity: 0.5;
        }
        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -35px) scale(1.03);
          }
          50% {
            transform: translate(-15px, -20px) scale(0.98);
          }
          75% {
            transform: translate(-20px, 15px) scale(1.01);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-25px, 20px) scale(1.04);
          }
          66% {
            transform: translate(15px, -18px) scale(0.97);
          }
        }
        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 25px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .group-hover\\:scale-110:hover {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}