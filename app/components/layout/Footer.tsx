// components/layout/Footer.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/products?category=phones", label: "Phones" },
      { href: "/products?category=laptops", label: "Laptops" },
      { href: "/products?category=monitors", label: "Monitors" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping & Returns" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const isLattie = mounted && resolvedTheme === "lattie";

  const bg = isDark
    ? "rgba(10,10,15,0.98)"
    : isLattie
    ? "rgba(244,242,238,0.98)"
    : "rgba(248,249,255,0.98)";
  const border = isDark
    ? "rgba(255,255,255,0.06)"
    : isLattie
    ? "rgba(0,0,0,0.05)"
    : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "#F0EEFF" : "#0D0F1A";
  const textSecondary = isDark ? "#A89EC8" : "#4B5170";
  const textMuted = isDark ? "#6B6088" : "#9299B8";
  const accent = isDark ? "#7B5FFF" : "#4F9EFF";

  return (
    <footer
      className="relative w-full mt-auto overflow-hidden"
      style={{ background: bg, borderTop: `1px solid ${border}` }}
    >
      {/* Moving gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px moving-gradient-line" />

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full animate-float-footer-1"
          style={{
            width: "clamp(250px, 35vw, 450px)",
            height: "clamp(250px, 35vw, 450px)",
            background: accent,
            opacity: 0.06,
            filter: "blur(90px)",
            bottom: "-10%",
            left: "-5%",
          }}
        />
        <div
          className="absolute rounded-full animate-float-footer-2"
          style={{
            width: "clamp(200px, 30vw, 400px)",
            height: "clamp(200px, 30vw, 400px)",
            background: accent,
            opacity: 0.05,
            filter: "blur(80px)",
            top: "-15%",
            right: "-5%",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-block group">
              <Image
                src="/kurate-logo-2.jpg"
                alt="Kurate"
                width={70}
                height={42}
                className="h-11 w-auto object-contain rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                priority
              />
            </Link>
            <p
              className="text-sm leading-relaxed max-w-[240px]"
              style={{ color: textSecondary }}
            >
              Premium tech marketplace connecting buyers with verified local
              sellers.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="space-y-5">
              <h4
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: textPrimary }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="relative inline-block text-sm transition-all duration-300 hover:translate-x-1"
                      style={{ color: textSecondary }}
                    >
                      {/* Animated underline on hover */}
                      <span className="relative">
                        {link.label}
                        <span
                          className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full"
                          style={{ background: accent }}
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + bottom line */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${border}` }}
        >
          <p className="text-xs" style={{ color: textMuted }}>
            &copy; {new Date().getFullYear()} Kurate. All rights reserved.
          </p>
          <p
            className="flex items-center gap-1.5 text-xs"
            style={{ color: textMuted }}
          >
            <Heart size={12} fill="#EF4444" stroke="#EF4444" />
            Built for tech enthusiasts
            <Sparkles size={12} style={{ color: accent }} />
          </p>
        </div>
      </div>

      <style jsx>{`
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

        .animate-float-footer-1 {
          animation: floatFooter1 22s ease-in-out infinite;
        }
        .animate-float-footer-2 {
          animation: floatFooter2 26s ease-in-out infinite;
          animation-delay: -4s;
        }

        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes floatFooter1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -20px) scale(1.05);
          }
        }

        @keyframes floatFooter2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, 25px) scale(1.04);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line,
          .animate-float-footer-1,
          .animate-float-footer-2 {
            animation: none;
          }
        }
      `}</style>
    </footer>
  );
}