"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  RefreshCw,
  Search,
  MessageCircle,
  ShieldAlert,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useThemeColors } from "../hooks/useThemeColors";
import { useInView } from "../hooks/useInView";
import { AnimatedCard } from "../components/AnimatedCard";

export default function ShippingReturnsPage() {
  const router = useRouter();
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } =
    useThemeColors();
  const { ref: headerRef, inView: headerInView } = useInView(0.2);

  const steps = [
    {
      step: 1,
      title: "Discover product",
      desc: "Buyer finds a gadget on the Kurate website.",
      icon: Search,
    },
    {
      step: 2,
      title: "Contact seller",
      desc: "Buyer clicks “Contact Seller” — opens WhatsApp with pre‑filled product details.",
      icon: MessageCircle,
    },
    {
      step: 3,
      title: "Negotiate & arrange",
      desc: "Buyer and seller agree on price, payment method, and handoff directly over WhatsApp.",
      icon: MapPin,
    },
    {
      step: 4,
      title: "Pickup / delivery",
      desc: "In‑shop pickup, meetup, or seller‑arranged delivery (using third‑party logistics like Gokada, Bolt, or personal courier).",
      icon: Truck,
    },
  ];

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
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="group-hover:text-primary transition-colors">Back</span>
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
            <Truck size={32} className="text-primary" />
          </div>
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: textPrimary }}
          >
            Shipping &{" "}
            <span style={{ color: accent }}>Returns</span>
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: textSecondary }}>
            How products move from seller to buyer — and what happens if you want to return an item.
          </p>
        </div>

        {/* Shipping Process */}
        <AnimatedCard accentColor={accent} className="mb-10">
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
              <Truck size={24} style={{ color: accent }} /> How Shipping Works on Kurate
            </h2>

            <p className="text-base leading-relaxed" style={{ color: textSecondary }}>
              Kurate is a marketplace platform, not a logistics or e‑commerce fulfillment service. We do not ship, deliver, or transport products.
            </p>

            {/* Process Steps */}
            <div className="space-y-6 mt-6">
              {steps.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: `${accent}15`, color: accent }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1" style={{ color: textPrimary }}>
                        {item.step}. {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seller/Buyer responsibility */}
            <div className="border-t pt-6 space-y-4" style={{ borderColor: border }}>
              <div>
                <h3 className="text-sm uppercase tracking-wider font-semibold mb-2 flex items-center gap-2" style={{ color: textMuted }}>
                  <ShieldAlert size={16} /> Seller Responsibility
                </h3>
                <p className="text-sm" style={{ color: textSecondary }}>
                  Sellers are solely responsible for packaging, dispatching, and ensuring products reach buyers if delivery is agreed upon. Kurate does not track, insure, or guarantee deliveries.
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider font-semibold mb-2 flex items-center gap-2" style={{ color: textMuted }}>
                  <ShieldAlert size={16} /> Buyer Responsibility
                </h3>
                <p className="text-sm" style={{ color: textSecondary }}>
                  Buyers must confirm product condition, seller identity, and delivery terms before payment. Kurate recommends in‑person inspection for transactions over ₦50,000.
                </p>
              </div>
            </div>

            <div className="border-t pt-4" style={{ borderColor: border }}>
              <p className="text-sm italic" style={{ color: textMuted }}>
                No Kurate involvement in fulfillment: we do not hold inventory, process payments, generate waybills, or mediate delivery disputes. Our platform ends at the connection. What happens after WhatsApp is between buyer and seller.
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Returns Policy */}
        <AnimatedCard accentColor={accent} className="mb-16">
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
              <RefreshCw size={24} style={{ color: accent }} /> Returns & Refunds
            </h2>
            <p className="text-base leading-relaxed" style={{ color: textSecondary }}>
              Return policies are set individually by each seller. Kurate does not handle returns. Always confirm the seller's return, refund, and warranty policy before purchase via WhatsApp. We recommend saving your chat history as proof of agreement.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ borderColor: border, background: `${accent}05` }}>
              <AlertTriangle size={20} style={{ color: accent }} />
              <p className="text-sm" style={{ color: textSecondary }}>
                For high‑value items, ask the seller for a written warranty or return policy before paying. Kurate bans sellers who repeatedly violate their stated terms, but we cannot enforce individual return agreements.
              </p>
            </div>
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