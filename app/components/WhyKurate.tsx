'use client';

import { useTheme } from '@/app/lib/theme';
import { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  FileSearch,
  MessageCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const props = [
  {
    id: 'verified',
    icon: ShieldCheck,
    accent: '#4F9EFF',
    tag: 'Trust',
    title: 'Every seller is verified.',
    body: 'No ghost accounts. No nameless vendors. Every seller on Kurate goes through a verification process before they can list. You know who you\'re buying from before you tap Contact.',
    metric: '120+',
    metricLabel: 'Verified sellers',
    detail: 'Verification checks include store name, WhatsApp number and identity confirmation.',
  },
  {
    id: 'specs',
    icon: FileSearch,
    accent: '#7B5FFF',
    tag: 'Clarity',
    title: 'Full specs. Always.',
    body: 'RAM. Storage. Display size. Battery health. Condition rating. Every listing is required to include the information you actually need. No more asking. No more guessing from a blurry photo.',
    metric: '30+',
    metricLabel: 'Spec fields per listing',
    detail: 'Sellers who skip specs get flagged. We keep the catalogue honest.',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    accent: '#C4B5FD',
    tag: 'Speed',
    title: 'One tap to the seller.',
    body: 'Found what you want? One tap opens WhatsApp directly with the person selling it. No signup wall. No messaging queue. No waiting room. Just you and the seller, instantly.',
    metric: '<2s',
    metricLabel: 'From listing to WhatsApp',
    detail: 'Works on any device. No app download required to contact sellers.',
  },
  {
    id: 'nomiddleman',
    icon: Layers,
    accent: '#4F9EFF',
    tag: 'Fairness',
    title: 'No middleman. Ever.',
    body: 'Kurate is a discovery layer — not a transaction processor. We connect you to sellers, not between you. You agree the price, you handle the transfer. The platform never touches your money.',
    metric: '0%',
    metricLabel: 'Commission on sales',
    detail: 'Free for buyers to browse. Free for sellers to list. Always.',
  },
];

function useInView(threshold = 0.15) {
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

function PropCard({
  prop,
  index,
  isDark,
  isLattie,
  inView,
  isActive,
  onActivate,
}: {
  prop: (typeof props)[number];
  index: number;
  isDark: boolean;
  isLattie: boolean;
  inView: boolean;
  isActive: boolean;
  onActivate: () => void;
}) {
  const Icon = prop.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onActivate}
      onKeyDown={(e) => e.key === 'Enter' && onActivate()}
      className="w-full md:w-[calc(50%-0.75rem)] h-full"
      style={{
        marginBottom: '1.5rem',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 100}ms,
                     transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 100}ms,
                     box-shadow 0.4s ease,
                     border-color 0.4s ease`,
        background: isDark
          ? isActive ? 'rgba(20,18,35,0.95)' : 'rgba(14,14,24,0.65)'
          : isLattie
          ? isActive ? 'rgba(252,250,247,1)' : 'rgba(250,248,245,0.8)'
          : isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.8)',
        border: `1px solid ${
          isActive
            ? prop.accent + '60'
            : hovered
            ? prop.accent + '40'
            : isDark
            ? 'rgba(255,255,255,0.06)'
            : isLattie
            ? 'rgba(196,181,253,0.2)'
            : 'rgba(79,158,255,0.1)'
        }`,
        backdropFilter: 'blur(16px)',
        boxShadow: isActive
          ? `0 30px 60px -20px ${prop.accent}, 0 0 0 1px ${prop.accent}30`
          : hovered
          ? `0 20px 40px -12px ${prop.accent}20`
          : isDark
          ? '0 2px 12px rgba(0,0,0,0.35)'
          : '0 2px 12px rgba(0,0,0,0.05)',
        borderRadius: '1rem',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {/* Active left bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '20%',
          bottom: '20%',
          width: '3px',
          borderRadius: '0 4px 4px 0',
          background: prop.accent,
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: '60%',
          paddingBottom: '60%',
          borderRadius: '50%',
          background: prop.accent,
          filter: 'blur(70px)',
          opacity: isActive ? 0.2 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      />
      <div className="p-4 sm:p-7 text-center sm:text-left">
        {/* Tag + metric row – stacked & centered on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: prop.accent + (isDark ? '18' : '12'),
              color: prop.accent,
              border: `1px solid ${prop.accent}28`,
            }}
          >
            {prop.tag}
          </span>
          <div className="text-center sm:text-right">
            <p
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                lineHeight: 1,
                color: isActive ? prop.accent : 'var(--color-text-muted)',
                transition: 'color 0.35s ease',
              }}
            >
              {prop.metric}
            </p>
            <p style={{ fontSize: '10px', marginTop: '0.25rem', color: 'var(--color-text-muted)' }}>
              {prop.metricLabel}
            </p>
          </div>
        </div>

        {/* Icon – centered on mobile */}
        <div
          className="mx-auto sm:mx-0 w-12 h-12 rounded-xl flex items-center justify-center mb-6"
          style={{
            background: isActive
              ? prop.accent + '20'
              : isDark
              ? 'rgba(255,255,255,0.05)'
              : isLattie
              ? 'rgba(196,181,253,0.1)'
              : 'rgba(79,158,255,0.06)',
            border: `1px solid ${isActive ? prop.accent + '40' : 'transparent'}`,
            transform: isActive ? 'scale(1.05) rotate(-4deg)' : 'scale(1) rotate(0)',
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <Icon size={20} style={{ color: isActive ? prop.accent : 'var(--color-text-secondary)' }} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 800,
            fontSize: '1.25rem',
            lineHeight: 1.3,
            marginBottom: '0.75rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {prop.title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            marginBottom: '1rem',
          }}
        >
          {prop.body}
        </p>

        {/* Detail slide-in */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isActive ? '60px' : '0',
            opacity: isActive ? 1 : 0,
            marginTop: isActive ? '1rem' : '0',
            transition: 'max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease',
          }}
        >
          <p
            className="text-xs sm:text-sm"
            style={{
              color: prop.accent,
              borderLeft: `2px solid ${prop.accent}50`,
              paddingLeft: '0.75rem',
              textAlign: 'center',
            }}
          >
            {prop.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export function WhyKurate() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActive] = useState(0);

  useEffect(() => setMounted(true), []);

  // Auto-cycle all 4 cards every 4 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % props.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const currentTheme = mounted ? (resolvedTheme ?? 'light') : 'light';
  const isDark = currentTheme === 'dark';
  const isLattie = currentTheme === 'lattie';

  const { ref: headRef, inView: headInView } = useInView(0.2);
  const { ref: gridRef, inView: gridInView } = useInView(0.1);

  const activeCard = props[activeIndex];

  return (
    <section
      aria-label="Why Kurate"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isDark
          ? '#0A0A0F'
          : isLattie
          ? '#F4F2EE'
          : '#F8F9FF',
        padding: 'clamp(80px, 12vw, 140px) 0',
      }}
    >
      {/* Ambient backgrounds */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
        <div
          style={{
            position: 'absolute',
            bottom: '-25%',
            right: '-15%',
            width: 'clamp(350px, 55vw, 800px)',
            height: 'clamp(350px, 55vw, 800px)',
            borderRadius: '50%',
            background: activeCard.accent,
            filter: 'blur(120px)',
            opacity: isDark ? 0.12 : isLattie ? 0.08 : 0.07,
            transition: 'background 1s ease, opacity 1s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-8%',
            width: 'clamp(200px, 30vw, 450px)',
            height: 'clamp(200px, 30vw, 450px)',
            borderRadius: '50%',
            background: isDark ? 'rgba(123,95,255,0.08)' : 'rgba(79,158,255,0.05)',
            filter: 'blur(80px)',
          }}
        />
        {isDark && (
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }} aria-hidden="true">
            <defs>
              <pattern id="grid-why" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-why)" />
          </svg>
        )}
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header - completely centered */}
        <div
          ref={headRef}
          style={{
            textAlign: 'center',
            maxWidth: '48rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            opacity: headInView ? 1 : 0,
            transform: headInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 1rem',
              borderRadius: '9999px',
              border: `1px solid ${isDark ? 'rgba(123,95,255,0.2)' : 'rgba(79,158,255,0.18)'}`,
              background: isDark ? 'rgba(123,95,255,0.08)' : 'rgba(79,158,255,0.06)',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '9999px',
                background: 'var(--brand-blurple)',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isDark ? 'var(--brand-lavender)' : 'var(--brand-blue)',
              }}
            >
              Why it matters
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: 'var(--color-text-primary)',
            }}
          >
            Built different.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              On purpose.
            </span>
          </h2>
          <p
            style={{
              marginTop: '1rem',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              maxWidth: '36ch',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Every decision in Kurate was made with one question — what actually makes buying and selling tech easier in Nigeria?
          </p>

          {/* Progress indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }} aria-hidden="true">
            {props.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                style={{
                  width: i === activeIndex ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: i === activeIndex ? p.accent : isDark ? 'rgba(255,255,255,0.12)' : 'var(--color-border)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                aria-label={`View ${p.tag}`}
              />
            ))}
          </div>
        </div>

        {/* Cards container – flexbox, 2 per row, stacked on mobile */}
        <div
          ref={gridRef}
          className="flex flex-wrap justify-center gap-6"
        >
          {props.map((prop, i) => (
            <PropCard
              key={prop.id}
              prop={prop}
              index={i}
              isDark={isDark}
              isLattie={isLattie}
              inView={gridInView}
              isActive={i === activeIndex}
              onActivate={() => setActive(i)}
            />
          ))}
        </div>

        {/* Bottom CTA - centered */}
        <div
          style={{
            marginTop: 'clamp(3rem, 6vw, 4rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
            opacity: gridInView ? 1 : 0,
            transform: gridInView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 600ms, transform 0.7s ease 600ms',
          }}
        >
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#fff',
              background: 'var(--brand-gradient)',
              boxShadow: '0 4px 24px -4px rgba(123,95,255,0.4)',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
            }}
            className="group"
          >
            Explore the marketplace
            <ArrowRight size={15} style={{ transition: 'transform 0.2s' }} className="group-hover:translate-x-1" />
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                background: 'var(--color-success)',
                animation: 'pulse 2s infinite',
              }}
            />
            No account needed to browse
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .group-hover\\:translate-x-1:hover svg {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}