"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Eye,
  FileText,
  Lock,
  Cookie,
  Users,
  Globe,
  Settings,
  UserCheck,
} from "lucide-react";
import { useThemeColors } from "../hooks/useThemeColors";
import { useInView } from "../hooks/useInView";
import { AnimatedCard } from "../components/AnimatedCard";

export default function PrivacyPolicyPage() {
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
            <Shield size={32} className="text-primary" />
          </div>
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: textPrimary }}
          >
            Privacy <span style={{ color: accent }}>Policy</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: textSecondary }}>
            How we collect, use, and protect your information.
          </p>
        </div>

        {/* Policy Content */}
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
              title="Introduction"
              icon={FileText}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              Kurate (“we,” “us,” or “our”) operates the Kurate marketplace platform
              (website and mobile applications). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use
              our services.
            </Section>

            {/* 2. Information We Collect */}
            <Section
              title="Information We Collect"
              icon={Eye}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <SubSection title="2.1 Account Information">
                Email address, phone number, password (hashed), user role
                (buyer/seller/admin). Collected during registration and login.
              </SubSection>
              <SubSection title="2.2 Seller‑Specific Information">
                Shop name, shop description, physical location, WhatsApp number.
                Business certificate or identification documents (for verification).
                Product listings, images, pricing, inventory data.
              </SubSection>
              <SubSection title="2.3 Automatic Information">
                IP address, browser type, device information, operating system.
                Pages visited, time spent, click patterns (via cookies and analytics).
                Product view logs (for seller analytics and platform improvement).
              </SubSection>
              <SubSection title="2.4 Cookies">
                Authentication tokens (httpOnly, secure cookies for session management).
                Preference cookies (theme selection: dark/light/minimalist). Analytics
                cookies (anonymous usage statistics).
              </SubSection>
            </Section>

            {/* 3. How We Use Your Information */}
            <Section
              title="How We Use Your Information"
              icon={Settings}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: textSecondary }}>
                <li>To provide and maintain the platform</li>
                <li>To verify seller identities and prevent fraud</li>
                <li>To enable buyer‑seller communication via WhatsApp integration</li>
                <li>To generate seller analytics (product views, engagement metrics)</li>
                <li>To improve user experience and platform functionality</li>
                <li>To send service‑related notifications (not marketing spam)</li>
              </ul>
            </Section>

            {/* 4. Information Sharing */}
            <Section
              title="Information Sharing"
              icon={Users}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              We do not sell your personal information. We share data only:
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm" style={{ color: textSecondary }}>
                <li>With sellers (public profile info: shop name, location, WhatsApp number)</li>
                <li>With buyers (seller verification status, product details)</li>
                <li>With service providers (hosting, analytics — under strict confidentiality)</li>
                <li>When legally required (court order, law enforcement)</li>
              </ul>
            </Section>

            {/* 5. Data Security */}
            <Section
              title="Data Security"
              icon={Lock}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: textSecondary }}>
                <li>Passwords hashed with bcrypt</li>
                <li>JWT tokens stored in httpOnly cookies (XSS‑resistant)</li>
                <li>Database encrypted at rest (PostgreSQL)</li>
                <li>Regular security audits and access controls</li>
              </ul>
            </Section>

            {/* 6. Your Rights */}
            <Section
              title="Your Rights"
              icon={UserCheck}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: textSecondary }}>
                <li>
                  <strong style={{ color: textPrimary }}>Access:</strong> Request a copy of your data
                </li>
                <li>
                  <strong style={{ color: textPrimary }}>Correction:</strong> Update inaccurate information
                </li>
                <li>
                  <strong style={{ color: textPrimary }}>Deletion:</strong> Request account deletion (soft delete with 30‑day grace period)
                </li>
                <li>
                  <strong style={{ color: textPrimary }}>Opt‑out:</strong> Disable non‑essential cookies
                </li>
              </ul>
              <p className="text-sm mt-3" style={{ color: textMuted }}>
                Contact: [privacy@kurate.com] for data requests.
              </p>
            </Section>

            {/* 7. Third‑Party Services */}
            <Section
              title="Third‑Party Services"
              icon={Globe}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: textSecondary }}>
                <li>
                  <strong style={{ color: textPrimary }}>WhatsApp:</strong> We generate wa.me links but do not access your WhatsApp data
                </li>
                <li>
                  <strong style={{ color: textPrimary }}>Hosting:</strong> Cloud/VPS provider (data stored in [region])
                </li>
                <li>
                  <strong style={{ color: textPrimary }}>Analytics:</strong> Anonymous, no personal identifiers
                </li>
              </ul>
            </Section>

            {/* 8. Children's Privacy */}
            <Section
              title="Children’s Privacy"
              icon={UserCheck}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              Kurate is not intended for users under 18. We do not knowingly collect data from minors.
            </Section>

            {/* 9. Changes to This Policy */}
            <Section
              title="Changes to This Policy"
              icon={FileText}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              We may update this policy. Significant changes will be notified via email or platform notice.
            </Section>

            {/* 10. Contact Us */}
            <Section
              title="Contact Us"
              icon={Globe}
              accent={accent}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            >
              <p className="text-sm" style={{ color: textSecondary }}>
                Privacy inquiries: [privacy@kurate.com]
              </p>
              <p className="text-sm" style={{ color: textSecondary }}>
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

/* ─── Helper components for section formatting ─── */
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
      <div className="pl-10 text-sm leading-relaxed" style={{ color: textSecondary }}>
        {children}
      </div>
    </div>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <h4
        className="text-sm font-semibold mb-1"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h4>
      <p className="text-sm" style={{ color: "inherit" }}>
        {children}
      </p>
    </div>
  );
}