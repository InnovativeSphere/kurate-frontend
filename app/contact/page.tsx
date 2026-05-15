// app/contact/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Clock, Sparkles, Send } from "lucide-react";
import { useThemeColors } from "../hooks/useThemeColors";
import { useInView } from "../hooks/useInView";
import { AnimatedCard } from "../components/AnimatedCard";

export default function ContactPage() {
  const router = useRouter();
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } =
    useThemeColors();
  const { ref: headerRef, inView: headerInView } = useInView(0.2);

  return (
    <main
      className="relative min-h-screen py-16 md:py-24 overflow-hidden"
      style={{ background: bgSubtle }}
    >
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1"
          style={{
            position: "absolute",
            width: "clamp(300px, 40vw, 500px)",
            height: "clamp(300px, 40vw, 500px)",
            borderRadius: "50%",
            background: accent,
            opacity: 0.08,
            filter: "blur(80px)",
            top: "-15%",
            left: "-10%",
            animation: "floatOrb1 25s ease-in-out infinite",
          }}
        />
        <div
          className="orb-2"
          style={{
            position: "absolute",
            width: "clamp(250px, 35vw, 450px)",
            height: "clamp(250px, 35vw, 450px)",
            borderRadius: "50%",
            background: accent,
            opacity: 0.06,
            filter: "blur(70px)",
            bottom: "-10%",
            right: "-5%",
            animation: "floatOrb2 30s ease-in-out infinite",
            animationDelay: "-5s",
          }}
        />
      </div>

      <div className="container max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Back button */}
        <div className="mb-8 transition-all duration-700">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium transition-all group opacity-70 hover:opacity-100"
            style={{ color: textSecondary }}
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="group-hover:text-primary transition-colors">Back</span>
          </button>
        </div>

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 md:mb-20 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary-subtle mb-4 md:mb-6">
            <Mail size={28} className="text-primary" />
          </div>
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: textPrimary }}
          >
            Get in <span style={{ color: accent }}>Touch</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: textSecondary }}>
            We’re here to help. A full contact form is on the way, but for now you can reach us directly via email.
          </p>
        </div>

        {/* Contact Card – increased internal spacing */}
        <AnimatedCard accentColor={accent} className="mb-16">
          <div className="p-8 sm:p-12 md:p-16 space-y-14 md:space-y-20 text-center">
            {/* Coming soon badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ background: `${accent}15`, color: accent }}
            >
              <Clock size={14} />
              Contact form coming soon
            </div>

            {/* Email section */}
            <div className="space-y-8 md:space-y-10">
              <div className="flex justify-center">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center"
                  style={{ background: `${accent}10`, color: accent }}
                >
                  <Send size={34} />
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold" style={{ color: textPrimary }}>
                Send us an email
              </h2>
              <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: textSecondary }}>
                For any questions, suggestions, or support requests, drop us a message at:
              </p>

              <a
                href="mailto:support.kurate@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-sm md:text-lg font-semibold transition-all hover:scale-105 active:scale-95 break-all"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                  color: "#ffffff",
                  boxShadow: `0 8px 24px -8px ${accent}60`,
                }}
              >
                <Mail size={18} />
                <span className="whitespace-nowrap">support.kurate@gmail.com</span>
              </a>
            </div>

            {/* Extra sparkle */}
            <div className="flex justify-center gap-4">
              <Sparkles size={16} style={{ color: accent, opacity: 0.6 }} />
              <Sparkles size={16} style={{ color: accent, opacity: 0.4 }} />
              <Sparkles size={16} style={{ color: accent, opacity: 0.6 }} />
            </div>

            <p className="text-xs" style={{ color: textMuted }}>
              We typically respond within 24–48 hours.
            </p>
          </div>
        </AnimatedCard>

        {/* Moving gradient line */}
        <div className="relative w-full h-px overflow-hidden mt-16">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      {/* Global animations */}
      <style jsx global>{`
        .moving-gradient-line {
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