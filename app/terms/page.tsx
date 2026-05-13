// app/terms/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  UserCheck,
  Shield,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Scale,
  Globe,
  Mail,
} from "lucide-react";
import { useThemeColors } from "../hooks/useThemeColors";
import { useInView } from "../hooks/useInView";
import { AnimatedCard } from "../components/AnimatedCard";

/* ─── Helper section component (reused inside the card) ─── */
function Section({
  title,
  icon: Icon,
  accent,
  textPrimary,
  textSecondary,
  children,
}: {
  title: string;
  icon: React.ComponentType<any>;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="text-lg font-semibold flex items-center gap-2 mb-3"
        style={{ color: textPrimary }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}15`, color: accent }}
        >
          <Icon size={18} />
        </div>
        {title}
      </h3>
      <div
        className="pl-10 text-sm leading-relaxed"
        style={{ color: textSecondary }}
      >
        {children}
      </div>
    </div>
  );
}

export default function TermsOfServicePage() {
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

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
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
            <span className="group-hover:text-primary transition-colors">
              Back
            </span>
          </button>
        </div>

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-subtle mb-4">
            <FileText size={32} className="text-primary" />
          </div>
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: textPrimary }}
          >
            Terms of <span style={{ color: accent }}>Service</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: textSecondary }}>
            The rules and guidelines for using the Kurate marketplace platform.
          </p>
        </div>

        {/* Terms Content */}
        <AnimatedCard accentColor={accent} className="mb-16">
          <div className="p-6 sm:p-8 space-y-8">
            {/* Effective Date */}
            <div>
              <p className="text-sm" style={{ color: textMuted }}>
                Effective Date: [Insert Date]
              </p>
            </div>

            {/* 1. Introduction */}
            <Section
              title="1. Introduction"
              icon={FileText}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              Welcome to Kurate (“we,” “us,” or “our”). By accessing or using our
              website and mobile applications (the “Platform”), you agree to be bound
              by these Terms of Service. If you do not agree, do not use the Platform.
              Kurate is a marketplace that connects verified local gadget sellers with
              buyers. We do not sell, deliver, or handle payments for any product
              listed on the Platform.
            </Section>

            {/* 2. Eligibility */}
            <Section
              title="2. Eligibility"
              icon={UserCheck}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              You must be at least 18 years old to use the Platform. By creating an
              account, you represent that you meet this age requirement and that all
              information you provide is accurate and complete.
            </Section>

            {/* 3. Accounts */}
            <Section
              title="3. Accounts"
              icon={UserCheck}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <p>
                You are responsible for maintaining the confidentiality of your login
                credentials and for all activities that occur under your account.
              </p>
              <p className="mt-2">
                Kurate reserves the right to suspend or terminate accounts that
                violate these Terms or engage in fraudulent or harmful activity.
              </p>
            </Section>

            {/* 4. Seller Terms */}
            <Section
              title="4. Seller Terms"
              icon={Shield}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sellers must complete our verification process and maintain
                  accurate shop information.
                </li>
                <li>
                  Products listed must be genuine and accurately described. Prohibited
                  items include counterfeits, stolen goods, and items that violate
                  applicable laws.
                </li>
                <li>
                  Sellers are responsible for all pricing, packaging, and delivery
                  arrangements. Kurate does not handle or guarantee any delivery.
                </li>
                <li>
                  We reserve the right to remove listings or suspend seller accounts
                  at our sole discretion.
                </li>
              </ul>
            </Section>

            {/* 5. Buyer Terms */}
            <Section
              title="5. Buyer Terms"
              icon={ShoppingBag}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Kurate only connects buyers and sellers. All transactions are
                  directly between the buyer and seller.
                </li>
                <li>
                  We do not process payments, hold funds, or provide refunds. Payment
                  terms are agreed upon between buyer and seller.
                </li>
                <li>
                  Buyers are encouraged to inspect products in person before payment,
                  especially for high-value items.
                </li>
                <li>
                  Kurate is not responsible for the quality, safety, or legality of
                  listed products.
                </li>
              </ul>
            </Section>

            {/* 6. Intellectual Property */}
            <Section
              title="6. Intellectual Property"
              icon={Globe}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              All content on the Platform (excluding user‑uploaded listing images) —
              including logos, graphics, text, and software — is owned by Kurate or
              its licensors. You may not copy, modify, or distribute any part of the
              Platform without prior written consent.
            </Section>

            {/* 7. Disclaimers */}
            <Section
              title="7. Disclaimers"
              icon={AlertTriangle}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <p>
                The Platform is provided “as is” without any warranties, express or
                implied. Kurate does not warrant that the Platform will be
                uninterrupted, error‑free, or free of harmful components.
              </p>
              <p className="mt-2">
                We are not a party to any transaction between users and disclaim all
                liability arising from such transactions.
              </p>
            </Section>

            {/* 8. Limitation of Liability */}
            <Section
              title="8. Limitation of Liability"
              icon={Scale}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              To the fullest extent permitted by law, Kurate shall not be liable for
              any indirect, incidental, special, or consequential damages arising out
              of your use of the Platform or any transaction between users.
            </Section>

            {/* 9. Termination */}
            <Section
              title="9. Termination"
              icon={UserCheck}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              We may suspend or terminate your account at any time, with or without
              cause, if you violate these Terms or engage in behavior that harms the
              Platform or other users. You may stop using the Platform at any time.
            </Section>

            {/* 10. Changes to Terms */}
            <Section
              title="10. Changes to Terms"
              icon={FileText}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              We may update these Terms from time to time. Material changes will be
              communicated via email or a notice on the Platform. Continued use of
              the Platform after changes become effective constitutes acceptance of
              the revised Terms.
            </Section>

            {/* 11. Contact */}
            <Section
              title="11. Contact"
              icon={Mail}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <p className="text-sm" style={{ color: textSecondary }}>
                For questions about these Terms, please contact us at
                [legal@kurate.com].
              </p>
              <p className="text-sm mt-1" style={{ color: textSecondary }}>
                General support: [support@kurate.com]
              </p>
            </Section>
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
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        @keyframes floatOrb1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.98);
          }
        }
        @keyframes floatOrb2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, 25px) scale(1.04);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line {
            animation: none;
          }
          .orb-1,
          .orb-2 {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}