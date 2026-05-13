'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import {
  Search,
  FileText,
  MessageCircle,
  Store,
  PackagePlus,
  Share2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// Data (unchanged)
const buyerSteps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse the catalogue',
    body: 'Search by name, category or price. Every listing has full specs, condition, price and seller info — no guessing, no back and forth.',
    accent: '#4F9EFF',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Read the full specs',
    body: 'RAM, storage, display, battery, condition rating — everything you need to decide is right there on the product page. One screen, full picture.',
    accent: '#7B5FFF',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Tap to contact the seller',
    body: 'One tap opens WhatsApp with the seller. No account needed. No waiting room. Just you and the person selling the thing you want.',
    accent: '#C4B5FD',
  },
];

const sellerSteps = [
  {
    number: '01',
    icon: Store,
    title: 'Create your store',
    body: 'Register, set your store name, add your WhatsApp number. Your storefront is live in under two minutes. No code, no fuss.',
    accent: '#4F9EFF',
  },
  {
    number: '02',
    icon: PackagePlus,
    title: 'List your products',
    body: 'Add photos, specs, price and condition from the seller dashboard. Every listing goes live instantly and is visible to anyone browsing Kurate.',
    accent: '#7B5FFF',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Share your store link',
    body: 'Copy your unique store URL and drop it anywhere — Instagram bio, WhatsApp status, Twitter. Buyers land on your page, not a cluttered feed.',
    accent: '#C4B5FD',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StepCard({
  step,
  index,
  isDark,
  isLattie,
  inView,
  isLast,
}: {
  step: (typeof buyerSteps)[number];
  index: number;
  isDark: boolean;
  isLattie: boolean;
  inView: boolean;
  isLast: boolean;
}) {
  const Icon = step.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 120}ms,
                     transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 120}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Connector line - desktop only */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            top: '2.5rem',
            left: 'calc(100% + 0.5rem)',
            width: 'calc(100% - 2rem)',
            zIndex: 1,
            pointerEvents: 'none',
            display: 'none',
          }}
          className="lg:flex items-center"
          aria-hidden="true"
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: `linear-gradient(90deg, ${step.accent}66, transparent)`,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: step.accent,
                transform: 'translate(-50%, -50%)',
                animation: 'travel 2.5s ease-in-out infinite',
                opacity: 0.7,
              }}
            />
          </div>
          <ChevronRight size={14} style={{ color: step.accent, opacity: 0.5, marginLeft: '-4px' }} />
        </div>
      )}

      {/* Card body */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          borderRadius: '1rem',
          padding: '1.75rem',
          overflow: 'hidden',
          background: isDark
            ? 'rgba(14,14,24,0.6)'
            : isLattie
            ? 'rgba(250,248,245,0.9)'
            : 'rgba(255,255,255,0.9)',
          border: `1px solid ${
            hovered
              ? step.accent + '50'
              : isDark
              ? 'rgba(255,255,255,0.06)'
              : isLattie
              ? 'rgba(196,181,253,0.2)'
              : 'rgba(79,158,255,0.1)'
          }`,
          backdropFilter: 'blur(16px)',
          boxShadow: hovered
            ? `0 24px 64px -16px ${step.accent}30`
            : isDark
            ? '0 2px 12px rgba(0,0,0,0.35)'
            : '0 2px 12px rgba(0,0,0,0.05)',
          transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-3rem',
            right: '-3rem',
            width: '9rem',
            height: '9rem',
            borderRadius: '50%',
            background: step.accent,
            filter: 'blur(55px)',
            opacity: hovered ? 0.2 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Step number watermark */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1.25rem',
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            lineHeight: 1,
            color: hovered ? step.accent : 'var(--color-border-strong)',
            opacity: hovered ? 0.35 : 0.25,
            transition: 'color 0.3s ease, opacity 0.3s ease',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {step.number}
        </div>

        {/* Icon */}
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            background: hovered
              ? step.accent + '20'
              : isDark
              ? 'rgba(255,255,255,0.05)'
              : isLattie
              ? 'rgba(196,181,253,0.12)'
              : 'rgba(79,158,255,0.07)',
            border: `1px solid ${hovered ? step.accent + '40' : 'transparent'}`,
            transform: hovered ? 'scale(1.08) rotate(-5deg)' : 'scale(1) rotate(0deg)',
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <Icon size={20} style={{ color: hovered ? step.accent : 'var(--color-text-secondary)' }} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 700,
            fontSize: '1.25rem',
            lineHeight: 1.3,
            marginBottom: '0.75rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {step.title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          {step.body}
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: step.accent + (isDark ? '15' : '10'),
            color: step.accent,
            border: `1px solid ${step.accent}25`,
          }}
        >
          Step {step.number}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  isDark,
  isLattie,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  isDark: boolean;
  isLattie: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '0.625rem 1.75rem',
        borderRadius: '2rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        background: active ? 'var(--brand-gradient)' : 'transparent',
        color: active ? '#fff' : 'var(--color-text-secondary)',
        boxShadow: active ? '0 4px 12px -2px rgba(123,95,255,0.4)' : 'none',
        border: active
          ? '1px solid transparent'
          : `1px solid ${
              isDark
                ? 'rgba(255,255,255,0.1)'
                : isLattie
                ? 'rgba(196,181,253,0.25)'
                : 'rgba(79,158,255,0.15)'
            }`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        backdropFilter: active ? 'none' : 'blur(4px)',
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export function HowItWorks() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => setMounted(true), []);

  const currentTheme = mounted ? (resolvedTheme ?? 'light') : 'light';
  const isDark = currentTheme === 'dark';
  const isLattie = currentTheme === 'lattie';

  const { ref: headRef, inView: headInView } = useInView(0.2);
  const { ref: gridRef, inView: gridInView } = useInView(0.1);

  const steps = activeTab === 'buyer' ? buyerSteps : sellerSteps;

  const handleTabChange = (tab: 'buyer' | 'seller') => {
    if (tab === activeTab) return;
    setFadeState('out');
    setTimeout(() => {
      setActiveTab(tab);
      setFadeState('in');
    }, 200);
  };

  return (
    <section
      aria-label="How Kurate works"
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
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(400px, 60vw, 900px)',
            height: 'clamp(400px, 60vw, 900px)',
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(123,95,255,0.06) 0%, transparent 70%)'
              : isLattie
              ? 'radial-gradient(circle, rgba(196,181,253,0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(79,158,255,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          padding: '0 2rem',
        }}
      >
        {/* ─── Header – fully centered ─── */}
        <div
          ref={headRef}
          style={{
            textAlign: 'center',
            maxWidth: '48rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 'clamp(2rem, 5vw, 3rem)',
            opacity: headInView ? 1 : 0,
            transform: headInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Eyebrow */}
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
              Simple by design
            </span>
          </div>

          {/* Headline */}
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
            Three steps.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              That&apos;s all it takes.
            </span>
          </h2>

          {/* Subheading */}
          <p
            style={{
              marginTop: '1rem',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              maxWidth: '42ch',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Whether you&apos;re buying your next gadget or selling the one gathering dust — Kurate keeps it clean.
          </p>
        </div>

        {/* ─── Tab switcher – centered, below header ─── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'clamp(3rem, 6vw, 4rem)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '3rem',
              background: isDark
                ? 'rgba(255,255,255,0.04)'
                : isLattie
                ? 'rgba(196,181,253,0.1)'
                : 'rgba(79,158,255,0.05)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'var(--color-border)'}`,
              backdropFilter: 'blur(8px)',
            }}
            role="tablist"
          >
            <TabButton
              active={activeTab === 'buyer'}
              onClick={() => handleTabChange('buyer')}
              label="I'm buying"
              isDark={isDark}
              isLattie={isLattie}
            />
            <TabButton
              active={activeTab === 'seller'}
              onClick={() => handleTabChange('seller')}
              label="I'm selling"
              isDark={isDark}
              isLattie={isLattie}
            />
          </div>
        </div>

        {/* ─── Steps grid – flexbox ─── */}
        <div
          ref={gridRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            transition: 'opacity 0.2s ease',
            opacity: fadeState === 'in' ? 1 : 0,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                flex: '0 0 calc(33.333% - 1rem)',
                maxWidth: 'calc(33.333% - 1rem)',
              }}
              className="step-card-wrapper"
            >
              <StepCard
                step={step}
                index={i}
                isDark={isDark}
                isLattie={isLattie}
                inView={gridInView}
                isLast={i === steps.length - 1}
              />
            </div>
          ))}
        </div>

        {/* ─── CTA row – centered ─── */}
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
            transition: 'opacity 0.7s cubic-bezier(0.22,1,0.36,1) 500ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) 500ms',
          }}
        >
          <Link
            href={activeTab === 'buyer' ? '/products' : '/auth/register?role=seller'}
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
            {activeTab === 'buyer' ? 'Start browsing' : 'Open your store'}
            <ArrowRight size={15} style={{ transition: 'transform 0.2s' }} className="group-hover:translate-x-1" />
          </Link>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem',
            }}
          >
            {activeTab === 'buyer' ? 'No account needed to browse.' : 'Free to list. Always.'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes travel {
          0%   { left: 0%; opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.8; }
          100% { left: 100%; opacity: 0; }
        }
        @media (max-width: 768px) {
          .step-card-wrapper {
            flex: 0 0 100% !important;
            max-width: 100% !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .step-card-wrapper {
            flex: 0 0 calc(50% - 0.75rem) !important;
            max-width: calc(50% - 0.75rem) !important;
          }
        }
        .group-hover\\:translate-x-1:hover svg {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}