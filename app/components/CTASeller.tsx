'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Store, Zap, CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/lib/theme';

const perks = [
  'Free to list. Always.',
  'Your store live in under 2 minutes.',
  'Direct WhatsApp — no platform fees.',
  'Share your store link anywhere.',
];

const stats = [
  { value: '120+', label: 'Active sellers', accent: '#4F9EFF' },
  { value: '500+', label: 'Products listed', accent: '#7B5FFF' },
  { value: '0%',   label: 'Commission',      accent: '#C4B5FD' },
];

const productImages = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop&auto=format',
];

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function CTASeller() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentTheme = mounted ? (resolvedTheme ?? 'light') : 'light';
  const isDark = currentTheme === 'dark';
  const isLattie = currentTheme === 'lattie';

  const { ref, inView } = useInView(0.15);

  return (
    <section
      aria-label="Start selling on Kurate"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isDark
          ? '#07070E'
          : isLattie
          ? '#ECE9E3'
          : '#F0F2FA',
        padding: 'clamp(80px, 12vw, 140px) 0',
      }}
    >
      {/* Ambient backgrounds */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(500px, 80vw, 1100px)',
            height: 'clamp(300px, 50vw, 700px)',
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(ellipse, rgba(123,95,255,0.18) 0%, rgba(79,158,255,0.08) 50%, transparent 70%)'
              : isLattie
              ? 'radial-gradient(ellipse, rgba(196,181,253,0.15) 0%, transparent 65%)'
              : 'radial-gradient(ellipse, rgba(79,158,255,0.1) 0%, rgba(123,95,255,0.06) 50%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: 'clamp(180px, 25vw, 380px)',
            height: 'clamp(180px, 25vw, 380px)',
            borderRadius: '50%',
            background: isDark ? 'rgba(79,158,255,0.1)' : 'rgba(123,95,255,0.06)',
            filter: 'blur(70px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            width: 'clamp(180px, 25vw, 380px)',
            height: 'clamp(180px, 25vw, 380px)',
            borderRadius: '50%',
            background: isDark ? 'rgba(196,181,253,0.1)' : 'rgba(79,158,255,0.07)',
            filter: 'blur(70px)',
          }}
        />
        {isDark && (
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.025 }} aria-hidden="true">
            <defs>
              <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        )}
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div
          ref={ref}
          style={{
            position: 'relative',
            borderRadius: '2rem',
            overflow: 'hidden',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.98)',
            transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)',
            background: isDark
              ? 'linear-gradient(135deg, rgba(20,18,35,0.95) 0%, rgba(14,14,24,0.98) 100%)'
              : isLattie
              ? 'linear-gradient(135deg, rgba(252,250,247,0.98) 0%, rgba(244,242,238,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,249,255,0.95) 100%)',
            border: `1px solid ${
              isDark
                ? 'rgba(123,95,255,0.2)'
                : isLattie
                ? 'rgba(196,181,253,0.25)'
                : 'rgba(79,158,255,0.15)'
            }`,
            boxShadow: isDark
              ? '0 32px 80px -20px rgba(123,95,255,0.25)'
              : '0 32px 80px -20px rgba(79,158,255,0.15)',
          }}
        >
          {/* Inner glow ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: '2rem',
              background: isDark
                ? 'radial-gradient(ellipse at 30% 50%, rgba(123,95,255,0.12) 0%, transparent 60%)'
                : 'radial-gradient(ellipse at 30% 50%, rgba(79,158,255,0.07) 0%, transparent 60%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'var(--brand-gradient)',
            }}
          />

          {/* Content layout – flex column on mobile, row on desktop */}
          <div
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center"
            style={{ padding: 'clamp(2rem, 5vw, 3rem)' }}
          >
            {/* Left column */}
            <div className="flex-1">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 1rem',
                  borderRadius: '9999px',
                  border: `1px solid ${isDark ? 'rgba(123,95,255,0.25)' : 'rgba(79,158,255,0.2)'}`,
                  background: isDark ? 'rgba(123,95,255,0.1)' : 'rgba(79,158,255,0.07)',
                  marginBottom: '2rem',
                }}
              >
                <Store size={12} style={{ color: isDark ? 'var(--brand-lavender)' : 'var(--brand-blue)' }} />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: isDark ? 'var(--brand-lavender)' : 'var(--brand-blue)',
                  }}
                >
                  For sellers
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1.5rem',
                }}
              >
                Your store.
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Your customers.
                </span>
                <br />
                Your terms.
              </h2>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                  maxWidth: '38ch',
                  marginBottom: '2rem',
                }}
              >
                Stop selling from a cluttered Instagram grid. Give your buyers a proper place to browse — full specs, real photos, one tap to reach you.
              </p>

              <div className="flex flex-col gap-4 mb-16">
                {perks.map((perk, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'translateX(0)' : 'translateX(-16px)',
                      transition: `opacity 0.5s ease ${300 + i * 80}ms, transform 0.5s ease ${300 + i * 80}ms`,
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: '#00B86E', flexShrink: 0 }} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* Buttons – fixed typo and padding */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/register/role"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'var(--brand-gradient)',
                    boxShadow: '0 6px 28px -4px rgba(123,95,255,0.5)',
                  }}
                >
                  <Zap size={18} />
                  Open your store — it&apos;s free
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>

                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    border: `2px solid ${isDark ? 'rgba(123,95,255,0.4)' : isLattie ? 'rgba(196,181,253,0.45)' : 'rgba(79,158,255,0.35)'}`,
                    color: 'var(--color-text-primary)',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = 'var(--brand-gradient)';
                    el.style.borderColor = 'transparent';
                    el.style.color = '#fff';
                    el.style.boxShadow = '0 6px 28px -4px rgba(123,95,255,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = '';
                    el.style.borderColor = isDark
                      ? 'rgba(123,95,255,0.4)'
                      : isLattie
                      ? 'rgba(196,181,253,0.45)'
                      : 'rgba(79,158,255,0.35)';
                    el.style.color = 'var(--color-text-primary)';
                    el.style.boxShadow = '';
                  }}
                >
                  Browse first
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>

            {/* Right column */}
            <div
              className="flex-1 flex flex-col gap-6"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(32px)',
                transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1) 200ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) 200ms',
              }}
            >
              {/* Mock store card */}
              <div
                className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl"
                style={{
                  background: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : isLattie
                    ? 'rgba(196,181,253,0.12)'
                    : 'rgba(79,158,255,0.08)',
                  border: `1px solid ${
                    isDark
                      ? 'rgba(255,255,255,0.12)'
                      : isLattie
                      ? 'rgba(196,181,253,0.3)'
                      : 'rgba(79,158,255,0.2)'
                  }`,
                }}
              >
                {/* Store header */}
                <div className="flex items-center gap-5 mb-8">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--brand-gradient)' }}
                  >
                    <Store size={24} color="#fff" />
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-3.5 rounded-full w-36 mb-2"
                      style={{ background: 'var(--color-border)' }}
                    />
                    <div
                      className="h-3 rounded-full w-28"
                      style={{ background: 'var(--color-border)', opacity: 0.6 }}
                    />
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                    style={{
                      background: 'rgba(0,184,110,0.15)',
                      color: '#00B86E',
                      border: '1px solid rgba(0,184,110,0.4)',
                    }}
                  >
                    Verified
                  </div>
                </div>

                {/* Product images grid */}
                <div className="grid grid-cols-3 gap-5 mb-8">
                  {productImages.map((src, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden relative transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                      }}
                    >
                      <img src={src} alt="Product preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  ))}
                </div>

                {/* Share URL row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 rounded-xl"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'var(--color-border)'}`,
                  }}
                >
                  <span
                    className="text-base flex-1 font-mono"
                    style={{ color: 'var(--color-text-primary)', fontWeight: 500, letterSpacing: '0.3px' }}
                  >
                    kurate.ng/store/your-store
                  </span>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'var(--brand-gradient)',
                      color: '#fff',
                      boxShadow: '0 2px 10px rgba(123,95,255,0.4)',
                    }}
                    aria-label="Copy store link"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                </div>
              </div>

              {/* Stat pills */}
              <div className="flex flex-col gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 px-6 py-5 rounded-xl transition-all duration-300 hover:translate-x-2 hover:scale-[1.01]"
                    style={{
                      background: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : isLattie
                        ? 'rgba(196,181,253,0.1)'
                        : 'rgba(79,158,255,0.06)',
                      border: `1px solid ${
                        isDark
                          ? 'rgba(255,255,255,0.1)'
                          : isLattie
                          ? 'rgba(196,181,253,0.25)'
                          : 'rgba(79,158,255,0.15)'
                      }`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark
                        ? 'rgba(255,255,255,0.1)'
                        : isLattie
                        ? 'rgba(196,181,253,0.2)'
                        : 'rgba(79,158,255,0.12)';
                      e.currentTarget.style.borderColor = stat.accent + '70';
                      e.currentTarget.style.boxShadow = `0 10px 24px -12px ${stat.accent}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark
                        ? 'rgba(255,255,255,0.05)'
                        : isLattie
                        ? 'rgba(196,181,253,0.1)'
                        : 'rgba(79,158,255,0.06)';
                      e.currentTarget.style.borderColor = isDark
                        ? 'rgba(255,255,255,0.1)'
                        : isLattie
                        ? 'rgba(196,181,253,0.25)'
                        : 'rgba(79,158,255,0.15)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <span
                      className="font-display font-black text-2xl"
                      style={{ color: stat.accent, minWidth: '70px' }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
                      {stat.label}
                    </span>
                    <div
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ background: stat.accent, opacity: 0.7 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .group-hover\\:translate-x-1\\.5:hover svg {
          transform: translateX(6px);
        }
      `}</style>
    </section>
  );
}