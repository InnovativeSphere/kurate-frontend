"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Truck,
  BadgeCheck,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  UserPlus,
  Lock,
  Mail,
  PhoneCall,
  Info,
} from "lucide-react";
import { useThemeColors } from "../hooks/useThemeColors";
import { useInView } from "../hooks/useInView";
import { AnimatedCard } from "../components/AnimatedCard";

const faqs = [
  {
    id: 1,
    question: "What is Kurate?",
    answer:
      "Kurate is a premium marketplace platform connecting verified local gadget sellers with buyers. We specialize in phones, laptops, PC setups, monitors, tablets, and desk accessories. We do not sell products ourselves — we provide the technology for sellers to showcase inventory and for buyers to discover and contact them directly.",
    icon: HelpCircle,
  },
  {
    id: 2,
    question: "Do you ship products or handle delivery?",
    answer:
      "No. Kurate does not handle shipping, logistics, or delivery. We connect you directly with the seller via WhatsApp. You and the seller arrange pickup, delivery, or meeting at their physical shop. Always verify the seller's location and identity before meeting.",
    icon: Truck,
  },
  {
    id: 3,
    question: "How do I know sellers are trustworthy?",
    answer:
      "Every seller on Kurate undergoes a verification process. Verified sellers display a badge on their profile and product pages. We verify business registration, physical shop location, and identity. However, we still recommend meeting in person for high-value transactions and inspecting products before payment.",
    icon: BadgeCheck,
  },
  {
    id: 4,
    question: "Is Kurate free for buyers?",
    answer:
      "Yes. Browsing, searching, and contacting sellers is completely free for buyers. We do not charge buyers any fees.",
    icon: CreditCard,
  },
  {
    id: 5,
    question: "How much does it cost to sell on Kurate?",
    answer:
      "Seller pricing varies by plan. We offer a free tier with limited listings and a premium tier with unlimited listings, analytics, and promotional features. Contact us via DM or email for current pricing.",
    icon: CreditCard,
  },
  {
    id: 6,
    question: "What happens if I get scammed?",
    answer:
      "Kurate verifies sellers to minimize risk, but we do not mediate transactions or handle payments. We strongly advise: (1) Only deal with verified sellers, (2) Inspect products in person before payment, (3) Use secure payment methods, (4) Report suspicious sellers immediately via our reporting feature. We ban sellers who violate our terms.",
    icon: AlertTriangle,
  },
  {
    id: 7,
    question: "Can I return a product?",
    answer:
      "Return policies are set individually by each seller. Kurate does not handle returns. Always confirm the seller's return, refund, and warranty policy before purchase via WhatsApp. We recommend saving your chat history as proof of agreement.",
    icon: RefreshCw,
  },
  {
    id: 8,
    question: "How do I become a seller?",
    answer:
      "Download the Kurate Seller app (Android), register your shop, submit verification documents (business certificate or valid ID), and wait for admin approval. Once verified, you can list products immediately.",
    icon: UserPlus,
  },
  {
    id: 9,
    question: "What information do you collect from me?",
    answer:
      "We collect minimal necessary data: email, phone number, and role (buyer/seller) for accounts. For sellers, we additionally collect shop name, location, WhatsApp number, and verification documents. We use cookies for authentication and analytics. See our full Privacy Policy for details.",
    icon: Lock,
  },
  {
    id: 10,
    question: "How do I contact Kurate support?",
    answer:
      "For general inquiries: [support email]. For seller support: [seller support email]. For urgent reports: DM us on Instagram or Twitter/X. Response time: 24-48 hours.",
    icon: PhoneCall,
  },
];

export default function FAQPage() {
  const router = useRouter();
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } =
    useThemeColors();
  const { ref: headerRef, inView: headerInView } = useInView(0.2);

  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

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

      <div className="container max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
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
            <HelpCircle size={32} className="text-primary" />
          </div>
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: textPrimary }}
          >
            Frequently Asked{" "}
            <span style={{ color: accent }}>Questions</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: textSecondary }}>
            Everything you need to know about Kurate — from buying to selling.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const Icon = faq.icon;

            return (
              <AnimatedCard key={faq.id} accentColor={accent}>
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-start gap-4 text-left transition-all"
                  aria-expanded={isOpen}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${accent}15`,
                      color: accent,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg font-semibold leading-snug"
                      style={{ color: textPrimary }}
                    >
                      {faq.question}
                    </h3>
                    {isOpen && (
                      <div
                        className="mt-3 text-base leading-relaxed animate-fade-in"
                        style={{ color: textSecondary }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-2 pt-1">
                    {isOpen ? (
                      <ChevronUp size={20} style={{ color: textMuted }} />
                    ) : (
                      <ChevronDown size={20} style={{ color: textMuted }} />
                    )}
                  </div>
                </button>
              </AnimatedCard>
            );
          })}
        </div>

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
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}