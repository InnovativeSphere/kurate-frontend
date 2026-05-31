// app/stores/page.tsx
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { fetchActiveSellers } from "../redux/slices/sellerSlice";
import { useThemeColors } from "../hooks/useThemeColors";
import { TechLoader } from "../components/TechLoader";
import {
  Store,
  BadgeCheck,
  MapPin,
  Phone,
  ChevronRight,
  ArrowRight,
  Search,
  MapPinned,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import type { Seller } from "../types/seller";

/* ─── fallback stores (shown when API returns none) ─── */
const FALLBACK_SELLERS: Seller[] = [
  {
    id: "fallback-1",
    shop_name: "GadgetHub Lagos",
    verification_status: "VERIFIED",
    location_text: "Ikeja, Lagos",
    whatsapp_number: "+234 801 234 5678",
    user_id: "",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-2",
    shop_name: "PhoneVille Abuja",
    verification_status: "VERIFIED",
    location_text: "Wuse, Abuja",
    whatsapp_number: "+234 802 345 6789",
    user_id: "",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-3",
    shop_name: "TechTrove PH",
    verification_status: "VERIFIED",
    location_text: "Port Harcourt",
    whatsapp_number: "+234 803 456 7890",
    user_id: "",
    created_at: "",
    updated_at: "",
  },
];

/* ─── accent colours ─── */
const STORE_ACCENTS = ["#4F9EFF", "#7B5FFF", "#C4B5FD"];

/* ─── Store Card (hover & effects) ──────────────── */
function StoreCard({
  seller,
  isActive,
  accentColor,
  onActivate,
}: {
  seller: Seller;
  isActive: boolean;
  accentColor: string;
  onActivate: () => void;
}) {
  const { textPrimary, textSecondary, textMuted, border } = useThemeColors();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onActivate}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onActivate()}
      className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
    >
      <div
        className="relative rounded-2xl overflow-hidden border backdrop-blur-md flex flex-col transition-all duration-300"
        style={{
          borderColor: isActive
            ? accentColor + "60"
            : hovered
            ? accentColor + "40"
            : border,
          background: "var(--card-bg)",
          filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
          transform: hovered && !isActive ? "translateY(-4px)" : "none",
          boxShadow: isActive
            ? `0 25px 50px -12px ${accentColor}40`
            : hovered
            ? `0 20px 40px -12px ${accentColor}20`
            : "0 4px 16px rgba(0,0,0,0.08)",
          transition:
            "filter 0.6s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
        }}
      >
        {/* active glow */}
        {isActive && (
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: accentColor,
              filter: "blur(60px)",
              opacity: 0.25,
            }}
          />
        )}

        <div className="p-6 sm:p-7 flex flex-col flex-1">
          {/* header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: isActive
                    ? accentColor + "20"
                    : hovered
                    ? accentColor + "15"
                    : "var(--card-border)",
                  transform:
                    hovered && !isActive ? "rotate(-6deg) scale(1.05)" : "rotate(0deg) scale(1)",
                }}
              >
                <Store
                  size={20}
                  style={{
                    color: isActive ? accentColor : hovered ? accentColor : "var(--text-muted)",
                  }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-green-500" />
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Verified
                </span>
              </div>
            </div>
            <div
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: isActive ? accentColor : "var(--text-muted)",
                opacity: isActive ? 1 : 0.4,
              }}
            />
          </div>

          {/* shop name */}
          <h3
            className="font-display font-bold text-xl mb-2 transition-colors duration-300"
            style={{ color: hovered ? accentColor : "var(--text-primary)" }}
          >
            {seller.shop_name}
          </h3>

          {seller.location_text && (
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-muted shrink-0" />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {seller.location_text}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-5">
            <Phone size={14} className="text-muted shrink-0" />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {seller.whatsapp_number}
            </span>
          </div>

          {/* view store button */}
          <Link
            href={`/stores/${seller.id}`}
            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`
                : hovered
                ? `linear-gradient(135deg, ${accentColor}dd, ${accentColor})`
                : "var(--brand-gradient)",
              color: "#fff",
              boxShadow: isActive
                ? `0 4px 12px -4px ${accentColor}60`
                : hovered
                ? `0 8px 20px -6px ${accentColor}50`
                : `0 4px 12px -4px ${accentColor}20`,
              transform: hovered ? "scale(1.03)" : "scale(1)",
            }}
          >
            View Store
            <ChevronRight
              size={16}
              className="transition-transform duration-300"
              style={{ transform: hovered ? "translateX(3px)" : "translateX(0)" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function StoresPage() {
  const dispatch = useAppDispatch();
  const { sellers, sellersLoading, error } = useAppSelector((s: RootState) => s.seller);
  const { bgSubtle, isDark, isLattie } = useThemeColors();

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchActiveSellers({ page: 1, limit: 100 }));
  }, [dispatch]);

  /* use fallback if API returns empty */
  const verifiedSellers = useMemo(() => {
    const apiList = sellers.filter((s) => s.verification_status === "VERIFIED");
    return apiList.length > 0 ? apiList : FALLBACK_SELLERS;
  }, [sellers]);

  /* ─── filters (with fixed TypeScript) ──────────── */
  const allLocations = useMemo(
    () =>
      [
        ...new Set(
          verifiedSellers
            .map((s) => s.location_text)
            .filter((l): l is string => !!l)
        ),
      ].sort(),
    [verifiedSellers]
  );

  const filteredSellers = useMemo(() => {
    let result = verifiedSellers;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (s) =>
          s.shop_name.toLowerCase().includes(q) ||
          (s.location_text && s.location_text.toLowerCase().includes(q))
      );
    }
    if (locationFilter !== "all") {
      result = result.filter((s) => s.location_text === locationFilter);
    }
    return result;
  }, [verifiedSellers, searchQuery, locationFilter]);

  /* ─── auto‑rotate with pause on grid hover ────── */
  const startAutoRotate = () => {
    if (filteredSellers.length <= 1) return;
    autoIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredSellers.length);
    }, 4000);
  };

  const stopAutoRotate = () => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoRotate();
    return stopAutoRotate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSellers.length]);

  useEffect(() => {
    if (activeIndex >= filteredSellers.length) setActiveIndex(0);
  }, [activeIndex, filteredSellers.length]);

  /* ─── loading & error ─────────────────────────── */
  if (sellersLoading) return <TechLoader text="Loading stores…" />;
  if (error) {
    return (
      <main className="relative min-h-screen flex items-center justify-center" style={{ background: bgSubtle }}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Connection hiccup
          </h2>
          <p className="text-sm text-muted mb-6">
            We couldn’t load the stores. Please check your network and try again.
          </p>
          <button
            onClick={() => dispatch(fetchActiveSellers({ page: 1, limit: 100 }))}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen" style={{ background: bgSubtle }}>
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-[-25%] right-[-15%] w-[clamp(350px,55vw,800px)] h-[clamp(350px,55vw,800px)] rounded-full blur-[120px] opacity-10"
          style={{
            background: isDark
              ? "rgba(123,95,255,0.12)"
              : isLattie
              ? "rgba(196,181,253,0.08)"
              : "rgba(79,158,255,0.07)",
          }}
        />
        <div
          className="absolute top-[-10%] left-[-8%] w-[clamp(200px,30vw,450px)] h-[clamp(200px,30vw,450px)] rounded-full blur-[80px]"
          style={{
            background: isDark ? "rgba(123,95,255,0.08)" : "rgba(79,158,255,0.05)",
          }}
        />
        {isDark && (
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" aria-hidden="true">
            <defs>
              <pattern id="grid-stores" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-stores)" />
          </svg>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-subtle mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Verified shops
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl mb-4 leading-tight">
            <span className="text-primary">Trusted</span> sellers,{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              real gadgets
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-lg mx-auto">
            Every store is hand‑verified. No ghost accounts. No guesswork.
          </p>

          {/* Filters */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full sm:flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search by store name or location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div className="relative w-full sm:w-52">
              <MapPinned size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="all">All locations</option>
                {allLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress dots */}
          {filteredSellers.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {filteredSellers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "28px" : "8px",
                    background:
                      i === activeIndex
                        ? STORE_ACCENTS[i % STORE_ACCENTS.length]
                        : "var(--color-border)",
                  }}
                  aria-label={`Show seller ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cards */}
        {filteredSellers.length === 0 ? (
          <div className="text-center py-20">
            <Store size={48} className="mx-auto text-muted opacity-30" />
            <p className="mt-4 text-muted">
              {verifiedSellers.length === 0
                ? "No verified stores yet."
                : "No stores match your search."}
            </p>
            {verifiedSellers.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("all");
                }}
                className="mt-4 text-sm text-primary underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div
            onMouseEnter={stopAutoRotate}
            onMouseLeave={startAutoRotate}
            className="flex flex-wrap justify-center gap-6"
          >
            {filteredSellers.map((seller, idx) => (
              <StoreCard
                key={seller.id}
                seller={seller}
                isActive={idx === activeIndex}
                accentColor={STORE_ACCENTS[idx % STORE_ACCENTS.length]}
                onActivate={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-gradient text-white font-semibold shadow-lg transition hover:-translate-y-1 active:scale-95"
          >
            Explore the marketplace
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-xs text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            No account needed to browse
          </p>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --card-bg: rgba(255, 255, 255, 0.6);
          --card-border: rgba(0,0,0,0.08);
          --text-primary: #0D0F1A;
          --text-secondary: #4B5170;
          --text-muted: #9299B8;
          --brand-gradient: linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD);
          --color-border: rgba(0,0,0,0.06);
        }
        .dark {
          --card-bg: rgba(20,18,35,0.8);
          --card-border: rgba(255,255,255,0.08);
          --text-primary: #F0EEFF;
          --text-secondary: #A89EC8;
          --text-muted: #6B6088;
          --color-border: rgba(255,255,255,0.12);
        }
        .lattie {
          --card-bg: rgba(252,250,247,0.9);
          --card-border: rgba(196,181,253,0.2);
          --text-primary: #1A1814;
          --text-secondary: #5C5851;
          --text-muted: #9C9890;
          --color-border: rgba(0,0,0,0.06);
        }
      `}</style>
    </main>
  );
}