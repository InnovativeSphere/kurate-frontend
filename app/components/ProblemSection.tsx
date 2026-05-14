'use client';

import { useTheme } from '@/app/lib/theme';
import { useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  Clock,
  HelpCircle,
  AlertTriangle,
  Eye,
  Ban,
} from 'lucide-react';

const problems = [
  {
    id: 'dm',
    icon: MessageCircle,
    eyebrow: 'The DM Spiral',
    title: '"Hi, is this available?"',
    body: 'You DM a seller. Hours pass. You follow up. Maybe they reply. Maybe they don\'t. You ask for specs. They send a blurry photo. You ask the price. Seen. You move on.',
    pain: 'Average wait: 4–6 hours',
    accent: '#4F9EFF',
  },
  {
    id: 'wait',
    icon: Clock,
    eyebrow: 'The Waiting Game',
    title: '"They were online 3h ago."',
    body: 'You found the perfect laptop. The seller posts daily but takes days to respond to buyers. You wait. Refresh. Check their story. Wait some more. It sells to someone else.',
    pain: 'Sold before you heard back',
    accent: '#7B5FFF',
  },
  {
    id: 'specs',
    icon: HelpCircle,
    eyebrow: 'The Spec Mystery',
    title: '"What\'s the RAM on this?"',
    body: 'No specs in the caption. Just "powerful laptop, good condition, selling fast." You ask. They send a photo of a screen. You squint. You ask again. Nobody has time for this.',
    pain: 'Zero specs. All guesswork.',
    accent: '#C4B5FD',
  },
  {
    id: 'trust',
    icon: AlertTriangle,
    eyebrow: 'The Trust Problem',
    title: '"Is this seller legit?"',
    body: 'New account. Three posts. No reviews. They want payment upfront. Their profile says Lagos but they ship from "abroad." Your gut says no but the price says yes. You take the risk.',
    pain: 'No verification. No recourse.',
    accent: '#4F9EFF',
  },
  {
    id: 'compare',
    icon: Eye,
    eyebrow: 'The Scroll Trap',
    title: '"There must be a better price."',
    body: 'You\'ve visited twelve pages. Screenshot seven listings. Screenshotted prices into a note. You can\'t remember which seller had which price. You start over.',
    pain: 'No way to compare side by side',
    accent: '#7B5FFF',
  },
  {
    id: 'ghost',
    icon: Ban,
    eyebrow: 'The Ghost',
    title: '"They deleted the post."',
    body: 'You agreed on a price. You went to get the transfer code. The post is gone. The account is private. The item you needed for work on Monday has vanished into thin air.',
    pain: 'No accountability. Just gone.',
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

function ProblemCard({
  problem,
  index,
  isDark,
  isLattie,
  inView,
}: {
  problem: (typeof problems)[number];
  index: number;
  isDark: boolean;
  isLattie: boolean;
  inView: boolean;
}) {
  const Icon = problem.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="problem-card group relative"
      style={{
        width: '100%', // will be controlled by flex parent
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms,
                     transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative h-full rounded-2xl overflow-hidden cursor-default"
        style={{
          background: isDark
            ? 'rgba(14,14,24,0.7)'
            : isLattie
            ? 'rgba(250,248,245,0.85)'
            : 'rgba(255,255,255,0.85)',
          border: `1px solid ${
            hovered
              ? problem.accent + '55'
              : isDark
              ? 'rgba(255,255,255,0.06)'
              : isLattie
              ? 'rgba(196,181,253,0.18)'
              : 'rgba(79,158,255,0.1)'
          }`,
          backdropFilter: 'blur(16px)',
          transition: 'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 20px 60px -12px ${problem.accent}33`
            : isDark
            ? '0 2px 12px rgba(0,0,0,0.4)'
            : '0 2px 12px rgba(0,0,0,0.06)',
          padding: '1.5rem',
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: problem.accent,
            filter: 'blur(50px)',
            opacity: hovered ? 0.25 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
          style={{
            color: hovered ? problem.accent : 'var(--color-text-muted)',
            transition: 'color 0.3s ease',
          }}
        >
          {problem.eyebrow}
        </p>
        <div className="flex items-start gap-3 mb-4">
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: hovered
                ? problem.accent + '22'
                : isDark
                ? 'rgba(255,255,255,0.05)'
                : isLattie
                ? 'rgba(196,181,253,0.1)'
                : 'rgba(79,158,255,0.06)',
              border: `1px solid ${hovered ? problem.accent + '44' : 'transparent'}`,
              transform: hovered ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            <Icon
              size={18}
              style={{
                color: hovered ? problem.accent : 'var(--color-text-muted)',
                transition: 'color 0.3s ease',
              }}
            />
          </div>
          <h3
            className="font-display font-bold text-base leading-snug"
            style={{ color: 'var(--color-text-primary)', marginTop: '0.25rem' }}
          >
            {problem.title}
          </h3>
        </div>
        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {problem.body}
        </p>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
          style={{
            background: problem.accent + (isDark ? '18' : '12'),
            color: problem.accent,
            border: `1px solid ${problem.accent}28`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: problem.accent }}
          />
          {problem.pain}
        </div>
      </div>
    </div>
  );
}

export function ProblemSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentTheme = mounted ? (resolvedTheme ?? 'light') : 'light';
  const isDark = currentTheme === 'dark';
  const isLattie = currentTheme === 'lattie';

  const { ref: sectionRef, inView } = useInView(0.1);
  const { ref: headRef, inView: headInView } = useInView(0.3);

  return (
    <section
      aria-label="The problem with buying tech on Instagram"
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
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: 'clamp(300px, 45vw, 700px)',
            height: 'clamp(300px, 45vw, 700px)',
            borderRadius: '50%',
            background: isDark
              ? 'rgba(123,95,255,0.12)'
              : isLattie
              ? 'rgba(196,181,253,0.15)'
              : 'rgba(79,158,255,0.08)',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '-8%',
            width: 'clamp(150px, 20vw, 320px)',
            height: 'clamp(150px, 20vw, 320px)',
            borderRadius: '50%',
            background: isDark
              ? 'rgba(79,158,255,0.1)'
              : 'rgba(123,95,255,0.06)',
            filter: 'blur(70px)',
          }}
        />
        {isDark && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '1px',
              height: '60%',
              background:
                'linear-gradient(to bottom, transparent, rgba(123,95,255,0.15), transparent)',
              transform: 'translate(-50%, -50%) rotate(25deg)',
            }}
          />
        )}
      </div>

      {/* Main container */}
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
        {/* Header – centered (same as before) */}
        <div
          ref={headRef}
          style={{
            maxWidth: '48rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            textAlign: 'center',
            opacity: headInView ? 1 : 0,
            transform: headInView ? 'translateY(0)' : 'translateY(24px)',
            transition:
              'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 1rem',
              borderRadius: '9999px',
              border: '1px solid rgba(239,68,68,0.2)',
              background: isDark
                ? 'rgba(239,68,68,0.08)'
                : 'rgba(239,68,68,0.05)',
              marginBottom: '1.75rem',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#EF4444' }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#EF4444',
              }}
            >
              Sound familiar?
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
            Buying tech on Instagram
            <br />
            <span
              style={{
                background:
                  'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              is a full-time job.
            </span>
          </h2>

          <p
            style={{
              marginTop: '1.5rem',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              maxWidth: '36ch',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            You shouldn&apos;t need patience, luck and a spare afternoon just to buy a laptop. Yet here we are.
          </p>

          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                height: '1px',
                width: '3rem',
                background: 'var(--color-border-strong)',
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              The six sins of Instagram tech buying
            </span>
            <div
              style={{
                height: '1px',
                width: '3rem',
                background: 'var(--color-border-strong)',
              }}
            />
          </div>
        </div>

        {/* Cards container – FLEXBOX: 2 cards per row */}
        <div
          ref={sectionRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          {problems.map((problem, i) => (
            <div
              key={problem.id}
              style={{
                flex: '0 0 calc(50% - 0.75rem)', // exactly 2 columns with gap accounted
                maxWidth: 'calc(50% - 0.75rem)',
              }}
              className="w-full sm:w-auto"
            >
              <ProblemCard
                problem={problem}
                index={i}
                isDark={isDark}
                isLattie={isLattie}
                inView={inView}
              />
            </div>
          ))}
        </div>

        {/* Bottom callout – centered */}
        <div
          style={{
            marginTop: 'clamp(3rem, 6vw, 5rem)',
            maxWidth: '42rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition:
              'opacity 0.7s cubic-bezier(0.22,1,0.36,1) 600ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) 600ms',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'var(--color-text-primary)',
            }}
          >
            There&apos;s a better way.{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              That&apos;s why we built Kurate.
            </span>
          </p>
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'var(--color-text-muted)',
            }}
          >
            Every product. Full specs. Verified sellers. One tap to WhatsApp. No DMs, no waiting, no guessing.
          </p>
        </div>
      </div>

      {/* No extra style block needed – flex handles everything */}
    </section>
  );
}