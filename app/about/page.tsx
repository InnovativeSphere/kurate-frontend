"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  Search,
  MessageCircle,
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  Package,
  Star,
  CheckCircle2,
  Rocket,
  Target,
  Globe,
} from "lucide-react";

// ============================================================
// Custom hook for scroll-triggered animations
// ============================================================
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
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, triggerOnce]);
  return { ref, inView };
}

// ============================================================
// Helper to get theme-aware colors inside components
// ============================================================
function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const isLattie = mounted && resolvedTheme === "lattie";
  return {
    isDark,
    isLattie,
    textPrimary: isDark ? "#F0EEFF" : isLattie ? "#1A1814" : "#0D0F1A",
    textSecondary: isDark ? "#A89EC8" : isLattie ? "#5C5851" : "#4B5170",
    border: isDark
      ? "rgba(255,255,255,0.08)"
      : isLattie
      ? "rgba(0,0,0,0.06)"
      : "rgba(0,0,0,0.06)",
    accent: isDark ? "#7B5FFF" : isLattie ? "#A0998F" : "#4F9EFF",
    bgSubtle: isDark ? "#0F0F1A" : isLattie ? "#F4F2EE" : "#F8F9FF",
  };
}

// ============================================================
// Moving gradient line component (reusable)
// ============================================================
function MovingGradientLine() {
  return (
    <div className="relative w-full h-px overflow-hidden mt-16">
      <div className="moving-gradient-line absolute inset-0" />
      <style jsx>{`
        .moving-gradient-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #4f9eff,
            #7b5fff,
            #c4b5fd,
            #7b5fff,
            #4f9eff,
            transparent
          );
          background-size: 200% 100%;
          animation: flowGradient 3s linear infinite;
          opacity: 0.6;
        }
        @keyframes flowGradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line {
            animation: none;
            background: linear-gradient(90deg, #4f9eff, #7b5fff, #c4b5fd);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Animated card wrapper (hover glow + moving border)
// ============================================================
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  accentColor?: string;
  onClick?: () => void;
  isActive?: boolean;
}

function AnimatedCard({
  children,
  className = "",
  hoverGlow = true,
  accentColor,
  onClick,
  isActive = false,
}: AnimatedCardProps) {
  const { isDark, isLattie, accent: defaultAccent, border } = useThemeColors();
  const finalAccent = accentColor || defaultAccent;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative rounded-2xl transition-all duration-500 ${className}`}
      style={{
        background: isDark
          ? isActive
            ? "rgba(20,18,35,0.95)"
            : "rgba(14,14,24,0.65)"
          : isLattie
          ? isActive
            ? "rgba(252,250,247,1)"
            : "rgba(250,248,245,0.8)"
          : isActive
          ? "rgba(255,255,255,1)"
          : "rgba(255,255,255,0.8)",
        border: `1px solid ${
          isActive
            ? finalAccent + "80"
            : hovered
            ? finalAccent + "60"
            : border
        }`,
        backdropFilter: "blur(16px)",
        boxShadow: isActive
          ? `0 30px 60px -20px ${finalAccent}, 0 0 0 1px ${finalAccent}30`
          : hovered
          ? `0 20px 40px -12px ${finalAccent}40`
          : isDark
          ? "0 2px 12px rgba(0,0,0,0.35)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => onClick && e.key === "Enter" && onClick()}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {/* Moving gradient border on hover */}
      {hoverGlow && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          <div className="absolute inset-0 rounded-2xl moving-border" />
        </div>
      )}
      {/* Active left bar (like WhyKurate) */}
      {isActive && (
        <div
          className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-md"
          style={{ background: finalAccent }}
        />
      )}
      {/* Background glow blob */}
      {isActive && (
        <div
          className="absolute -top-[30%] -right-[20%] w-[60%] pb-[60%] rounded-full blur-[70px] pointer-events-none"
          style={{ background: finalAccent, opacity: 0.2 }}
        />
      )}
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        .moving-border {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            90deg,
            transparent,
            ${finalAccent},
            ${finalAccent},
            transparent
          );
          background-size: 200% 100%;
          animation: slideBorder 1.5s linear infinite;
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 2px;
        }
        @keyframes slideBorder {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-border {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Main About Page
// ============================================================
export default function AboutPage() {
  const { isDark, isLattie, textPrimary, textSecondary, border, accent, bgSubtle } =
    useThemeColors();

  // Scroll reveal refs + states
  const { ref: heroRef, inView: heroInView } = useInView(0.2);
  const { ref: problemRef, inView: problemInView } = useInView(0.2);
  const { ref: solutionRef, inView: solutionInView } = useInView(0.2);
  const { ref: meaningRef, inView: meaningInView } = useInView(0.2);
  const { ref: howRef, inView: howInView } = useInView(0.2);
  const { ref: valuesRef, inView: valuesInView } = useInView(0.2);
  const { ref: impactRef, inView: impactInView } = useInView(0.2);
  const { ref: visionRef, inView: visionInView } = useInView(0.2);
  const { ref: ctaDualRef, inView: ctaDualInView } = useInView(0.2);
  const { ref: finalCtaRef, inView: finalCtaInView } = useInView(0.2);

  // Auto-cycle for Values section (like WhyKurate)
  const valuesList = [
    { icon: BadgeCheck, title: "Trust, not guesswork", desc: "Every seller is verified. Every product has full, honest specs. No 'seen' without reply — just direct, transparent deals." },
    { icon: Sparkles, title: "Curated, not cluttered", desc: "We hand‑select categories and sellers so you browse fewer, better things. No endless scroll, no decision fatigue." },
    { icon: HeartHandshake, title: "Human connection", desc: "Talk directly to sellers via WhatsApp. Pre‑filled messages mean you reach a real person, not a bot or comment void." },
    { icon: Target, title: "Quality obsessed", desc: "We don't race to be the biggest marketplace. We race to be the best. Every addition is intentional." },
    { icon: Users, title: "Community first", desc: "Buyers and sellers both win. We build for real people solving real problems, not for vanity metrics." },
    { icon: Globe, title: "Nigerian-made excellence", desc: "Built in Nigeria, for Nigeria. We understand local needs, local challenges, and local excellence." },
  ];
  const [activeValueIndex, setActiveValueIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValueIndex((prev) => (prev + 1) % valuesList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-20%] right-[-15%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20 animate-float"
            style={{ background: "#4F9EFF" }}
          />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-3xl opacity-15 animate-float-slow"
            style={{ background: "#7B5FFF" }}
          />
        </div>
        <div
          ref={heroRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 transition-all duration-700"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary-subtle mb-8 hover:border-primary/40 transition-all">
              <BadgeCheck size={16} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Our Story
              </span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Quality over quantity,
              </span>
              <br />
              <span className="inline-block mt-2" style={{ color: textPrimary }}>
                always.
              </span>
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10" style={{ color: textSecondary }}>
              Kurate was born to turn chaotic, overwhelming online shopping into a
              calm, empowering experience. We believe finding the perfect gadget
              should feel like strolling through a well‑lit, quiet store — not
              shouting into a noisy comment section.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
              >
                <ShoppingBag size={18} />
                Browse Marketplace
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 text-sm font-semibold transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95"
                style={{ borderColor: border, color: textPrimary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "";
                }}
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
        <MovingGradientLine />
      </section>

      {/* ========== PROBLEM SECTION (grid 2 cols) ========== */}
      <section className="py-20 md:py-32" style={{ background: bgSubtle }}>
        <div
          ref={problemRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 transition-all duration-700"
          style={{
            opacity: problemInView ? 1 : 0,
            transform: problemInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4" style={{ color: textPrimary }}>
              We saw a problem
            </h2>
            <p className="text-lg" style={{ color: textSecondary }}>
              Online shopping in Nigeria shouldn't feel like a gamble
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Search, title: "Information overload", desc: "Endless scrolling through duplicate listings, fake reviews, and products with zero specs. You never know if what you're buying matches the picture." },
              { icon: MessageCircle, title: "Communication chaos", desc: "Buyers flood comment sections with \"price please?\" while sellers ghost after payment. No direct connection, no accountability." },
              { icon: ShieldCheck, title: "Trust deficit", desc: "Who's behind that shop? Is this gadget legit? Will it arrive at all? Every purchase feels like crossing your fingers and hoping." },
              { icon: Zap, title: "Decision fatigue", desc: "100 options for the same phone case, all with identical stock photos. By the time you pick one, you're exhausted and unsure." },
            ].map((item, idx) => (
              <AnimatedCard key={idx} hoverGlow={true} accentColor={accent}>
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary-subtle flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <item.icon size={26} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-primary" style={{ color: textPrimary }}>
                    {item.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: textSecondary }}>
                    {item.desc}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SOLUTION SECTION ========== */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          ref={solutionRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 transition-all duration-700"
          style={{
            opacity: solutionInView ? 1 : 0,
            transform: solutionInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-subtle mb-6">
              <Rocket size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">The Kurate Way</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-6" style={{ color: textPrimary }}>
              So we built something different
            </h2>
            <p className="text-lg" style={{ color: textSecondary }}>
              A marketplace that respects your time, intelligence, and wallet
            </p>
          </div>
          <div className="space-y-20 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 text-center md:text-left">
                <AnimatedCard hoverGlow={true}>
                  <div className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <BadgeCheck size={24} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>Verified sellers only</h3>
                    <p className="leading-relaxed mb-4" style={{ color: textSecondary }}>
                      Every vendor on Kurate is hand-vetted. We verify business registration, 
                      check inventory, and confirm reputation. No anonymous accounts, 
                      no drop-shippers pretending to be warehouses.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary justify-center md:justify-start">
                      <CheckCircle2 size={16} />
                      <span className="font-semibold">100% verified businesses</span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative w-48 h-48 rounded-2xl bg-primary-subtle flex items-center justify-center transition-all hover:scale-105 hover:rotate-6">
                  <ShieldCheck size={80} className="text-primary opacity-80" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-2xl bg-primary-subtle flex items-center justify-center transition-all hover:scale-105 hover:-rotate-6">
                  <Package size={80} className="text-primary opacity-80" />
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full glass flex items-center justify-center border shadow-lg" style={{ borderColor: border }}>
                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <AnimatedCard hoverGlow={true}>
                  <div className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <Sparkles size={24} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>Curated, quality-first catalog</h3>
                    <p className="leading-relaxed mb-4" style={{ color: textSecondary }}>
                      We don't list everything — we list the best. Products are selected 
                      for quality, authenticity, and actual demand. Complete specs, 
                      real photos, honest descriptions. No clutter, no confusion.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary justify-center md:justify-start">
                      <CheckCircle2 size={16} />
                      <span className="font-semibold">Only premium tech makes the cut</span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
            {/* Card 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 text-center md:text-left">
                <AnimatedCard hoverGlow={true}>
                  <div className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <MessageCircle size={24} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>Direct WhatsApp connection</h3>
                    <p className="leading-relaxed mb-4" style={{ color: textSecondary }}>
                      No comment section chaos. One click opens WhatsApp with a 
                      pre-filled message to the seller. Real conversations, real people, 
                      real accountability. Get answers fast.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary justify-center md:justify-start">
                      <CheckCircle2 size={16} />
                      <span className="font-semibold">Instant seller contact</span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative w-48 h-48 rounded-2xl bg-green-500/10 flex items-center justify-center transition-all hover:scale-105 hover:rotate-6">
                  <MessageCircle size={80} className="text-green-600 opacity-80" />
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-pulse shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MovingGradientLine />
      </section>

      {/* ========== KURATE MEANING SECTION (Curate + Rate) ========== */}
      <section className="py-20 md:py-32" style={{ background: bgSubtle }}>
        <div
          ref={meaningRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 transition-all duration-700"
          style={{
            opacity: meaningInView ? 1 : 0,
            transform: meaningInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-subtle mx-auto md:mx-0">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">The Name</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl" style={{ color: textPrimary }}>
                Kurate = Curate + Rate
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: textSecondary }}>
                <span className="font-semibold" style={{ color: textPrimary }}>Kurate</span> is
                a blend of "curate" and "rate." It's our quiet promise: every
                product you see has been thoughtfully selected by real vendors,
                then organically ranked by quality, not by ad spend.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: textSecondary }}>
                No algorithms pushing plastic junk. No sponsored posts masquerading 
                as recommendations. Just genuine tech, elevated by people who care 
                about what they sell.
              </p>
              <div className="space-y-3">
                {[
                  { text: "Curate: Hand-picked products that meet our quality standards" },
                  { text: "Rate: Ranked by genuine quality, real reviews, and seller reputation" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 justify-center md:justify-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-primary" />
                    </div>
                    <p className="text-secondary" style={{ color: textSecondary }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative max-w-sm w-full p-10 glass rounded-3xl border transition-all hover:scale-105 hover:shadow-2xl group" style={{ borderColor: border }}>
                <Image src="/kurate-logo-2.jpg" alt="Kurate" width={80} height={60} className="h-16 w-auto mx-auto opacity-90 group-hover:opacity-100 transition" />
                <div className="mt-8 text-center space-y-2">
                  <p className="text-sm font-mono uppercase tracking-[0.3em] group-hover:text-primary transition-colors" style={{ color: textSecondary }}>Discover</p>
                  <div className="h-px w-16 mx-auto bg-border group-hover:bg-primary transition-colors" />
                  <p className="text-sm font-mono uppercase tracking-[0.3em] group-hover:text-primary transition-colors" style={{ color: textSecondary }}>Collect</p>
                  <div className="h-px w-16 mx-auto bg-border group-hover:bg-primary transition-colors" />
                  <p className="text-sm font-mono uppercase tracking-[0.3em] group-hover:text-primary transition-colors" style={{ color: textSecondary }}>Repeat</p>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition duration-500">
                  <Sparkles size={20} className="text-primary animate-pulse" />
                </div>
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition duration-500 rounded-tl-3xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition duration-500 rounded-br-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS (4 steps) ========== */}
      <section className="py-20 md:py-32">
        <div
          ref={howRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 transition-all duration-700"
          style={{
            opacity: howInView ? 1 : 0,
            transform: howInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-subtle mb-6">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Simple Process</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4" style={{ color: textPrimary }}>How Kurate works</h2>
            <p className="text-lg" style={{ color: textSecondary }}>Shopping made simple, transparent, and direct</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {[
              { step: "01", icon: Search, title: "Browse curated products", desc: "Explore our hand-picked catalog of verified tech. Every listing includes complete specs, real photos, and honest pricing. No duplicates, no junk." },
              { step: "02", icon: Star, title: "Check ratings & reviews", desc: "See what other buyers say. Our rating system is organic — no fake reviews, no paid promotions. Quality rises to the top naturally." },
              { step: "03", icon: MessageCircle, title: "Connect via WhatsApp", desc: "Found what you want? One click opens WhatsApp with a pre-filled message to the seller. Ask questions, negotiate, finalize details — all in real-time." },
              { step: "04", icon: ShoppingBag, title: "Complete your purchase", desc: "Buy with confidence. Discuss delivery, payment, and warranty directly. Every seller is accountable, every transaction is transparent." },
            ].map((item, idx) => (
              <div key={idx} className="group text-center md:text-left">
                <div className="inline-block mb-4">
                  <span className="text-6xl font-black font-display text-primary/20 group-hover:text-primary/30 transition-colors">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>{item.title}</h3>
                <p className="text-secondary leading-relaxed" style={{ color: textSecondary }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VALUES SECTION (Auto‑cycling + Progress dots) ========== */}
      <section className="py-20 md:py-32" style={{ background: bgSubtle }}>
        <div
          ref={valuesRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 transition-all duration-700"
          style={{
            opacity: valuesInView ? 1 : 0,
            transform: valuesInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-subtle mb-6">
              <HeartHandshake size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Core Values</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4" style={{ color: textPrimary }}>What we stand for</h2>
            <p className="text-lg" style={{ color: textSecondary }}>The principles that guide every decision we make</p>
            {/* Progress indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {valuesList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveValueIndex(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeValueIndex ? "28px" : "8px",
                    background:
                      i === activeValueIndex
                        ? accent
                        : isDark
                        ? "rgba(255,255,255,0.12)"
                        : border,
                  }}
                  aria-label={`View value ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {valuesList.map((val, idx) => {
              const isActive = idx === activeValueIndex;
              return (
                <AnimatedCard
                  key={idx}
                  hoverGlow={true}
                  accentColor={accent}
                  isActive={isActive}
                  onClick={() => setActiveValueIndex(idx)}
                >
                  <div className="p-8 text-center relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <val.icon size={28} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors" style={{ color: textPrimary }}>
                      {val.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
                      {val.desc}
                    </p>
                    {isActive && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== IMPACT SECTION (stats) ========== */}
      <section className="py-20 md:py-32">
        <div
          ref={impactRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 transition-all duration-700"
          style={{
            opacity: impactInView ? 1 : 0,
            transform: impactInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4" style={{ color: textPrimary }}>The Kurate impact</h2>
            <p className="text-lg" style={{ color: textSecondary }}>Real numbers from real growth</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: "500+", label: "Verified Sellers", icon: ShieldCheck },
              { number: "10K+", label: "Quality Products", icon: Package },
              { number: "25K+", label: "Happy Buyers", icon: Users },
              { number: "98%", label: "Satisfaction Rate", icon: Star },
            ].map((stat, idx) => (
              <AnimatedCard key={idx} hoverGlow={true}>
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-subtle flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110 group-hover:rotate-12">
                    <stat.icon size={24} className="text-primary" />
                  </div>
                  <div className="text-4xl font-black font-display mb-2 group-hover:scale-110 transition">
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {stat.number}
                    </span>
                  </div>
                  <div className="text-sm font-medium" style={{ color: textSecondary }}>{stat.label}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VISION SECTION ========== */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{ background: bgSubtle }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-gradient-to-bl from-primary to-transparent" />
        </div>
        <div
          ref={visionRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 transition-all duration-700"
          style={{
            opacity: visionInView ? 1 : 0,
            transform: visionInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-subtle mb-8">
              <Rocket size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Where We're Headed</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-8" style={{ color: textPrimary }}>
              Building the future of <br className="hidden sm:block" />
              Nigerian e-commerce
            </h2>
            <AnimatedCard hoverGlow={true}>
              <div className="p-8 md:p-12">
                <p className="text-lg leading-relaxed mb-6" style={{ color: textSecondary }}>
                  We're not just building a marketplace — we're building trust infrastructure 
                  for Nigeria's digital economy. A place where quality sellers thrive, 
                  smart buyers save time, and everyone wins through transparency.
                </p>
                <p className="text-lg leading-relaxed mb-8" style={{ color: textSecondary }}>
                  Our vision? To become the first place Nigerians think of when they need 
                  tech. Not the biggest, not the loudest — the most trusted.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-subtle">
                    <TrendingUp size={18} className="text-primary" />
                    <span className="text-sm font-semibold text-primary">Expanding nationwide</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-subtle">
                    <Sparkles size={18} className="text-primary" />
                    <span className="text-sm font-semibold text-primary">More categories</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-subtle">
                    <Users size={18} className="text-primary" />
                    <span className="text-sm font-semibold text-primary">Growing community</span>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
        <MovingGradientLine />
      </section>

      {/* ========== DUAL CTA (Buyers & Sellers) ========== */}
      <section className="py-20 md:py-32">
        <div
          ref={ctaDualRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 transition-all duration-700"
          style={{
            opacity: ctaDualInView ? 1 : 0,
            transform: ctaDualInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4" style={{ color: textPrimary }}>Built for both sides</h2>
            <p className="text-lg" style={{ color: textSecondary }}>Whether you're shopping or selling, Kurate elevates your experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* For Buyers */}
            <AnimatedCard hoverGlow={true} accentColor="#4F9EFF">
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110 group-hover:rotate-6">
                  <ShoppingBag size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: textPrimary }}>For Buyers</h3>
                <p className="leading-relaxed mb-6" style={{ color: textSecondary }}>
                  Shop smarter, not harder. Every product curated for quality, 
                  every seller verified for trust.
                </p>
                <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                  {[
                    "Complete product specifications",
                    "Verified seller reputation",
                    "Direct WhatsApp communication",
                    "Transparent pricing",
                    "Quality-ranked listings",
                    "Zero decision fatigue",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} className="text-primary" />
                      </div>
                      <span className="text-sm" style={{ color: textSecondary }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                >
                  Start Shopping
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimatedCard>
            {/* For Sellers */}
            <AnimatedCard hoverGlow={true} accentColor="#7B5FFF">
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110 group-hover:rotate-6">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: textPrimary }}>For Sellers</h3>
                <p className="leading-relaxed mb-6" style={{ color: textSecondary }}>
                  Reach serious buyers who value quality. Build your reputation 
                  on merit, not marketing budget.
                </p>
                <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                  {[
                    "Verified business badge",
                    "Quality-focused audience",
                    "Direct customer communication",
                    "Fair ranking system",
                    "Premium brand association",
                    "No race-to-the-bottom pricing",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} className="text-primary" />
                      </div>
                      <span className="text-sm" style={{ color: textSecondary }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sell"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                >
                  Become a Seller
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative py-24 md:py-40 overflow-hidden" style={{ background: bgSubtle }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-10 animate-float" style={{ background: accent }} />
        </div>
        <div
          ref={finalCtaRef}
          className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 transition-all duration-700"
          style={{
            opacity: finalCtaInView ? 1 : 0,
            transform: finalCtaInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-subtle mb-8">
              <Rocket size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Join Us</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Ready to discover tech</span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">the right way?</span>
            </h2>
            <p className="text-lg sm:text-xl mb-12 leading-relaxed" style={{ color: textSecondary }}>
              Whether you're buying your next daily driver or selling stock from
              your store, Kurate puts clarity and quality back in your hands.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-base font-bold shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
              >
                <ShoppingBag size={20} />
                Start Browsing
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sell"
                className="group inline-flex items-center gap-2 px-10 py-5 rounded-xl border-2 text-base font-bold transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
                style={{ borderColor: border, color: textPrimary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "";
                }}
              >
                <Sparkles size={20} />
                Become a Seller
              </Link>
            </div>
            <div className="mt-16 pt-12 border-t max-w-2xl mx-auto" style={{ borderColor: border }}>
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm" style={{ color: textSecondary }}>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Verified sellers only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  <span>Quality-first catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-primary" />
                  <span>Direct WhatsApp contact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MovingGradientLine />
      </section>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-3%, -3%) scale(1.03); }
          66% { transform: translate(2%, -1%) scale(0.98); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-4%, -4%) scale(1.05); }
          66% { transform: translate(3%, -2%) scale(0.97); }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 25s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-float-slow { animation: none; }
        }
      `}</style>
    </main>
  );
}