// components/FeaturedProducts.tsx
"use client";

import { useTheme } from '@/app/lib/theme';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Star,
  Shield,
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { fetchProducts } from "../redux/slices/productSlice";
import {
  fetchMyWishlist,
  addToWishlist,
  removeFromWishlistByProductId,
} from "../redux/slices/wishlistSlice";
import { fetchActiveSellers } from "../redux/slices/sellerSlice";
import { AuthRequiredModal } from "./AuthRequiredModal";
import { TechLoader } from "./TechLoader";
import { Product } from "../types/product";

// ── Helper to convert condition to a score for the dots ──
function conditionToScore(condition: string): number {
  switch (condition) {
    case "NEW": return 5;
    case "USED": return 3;
    case "REFURBISHED": return 4;
    default: return 3;
  }
}

function ConditionDots({ score, accent }: { score: number; accent: string }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((d) => (
        <div
          key={d}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: d <= score ? accent : "var(--color-border)",
            transition: "background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  isDark,
  isLattie,
  isCentered,
  isWishlisted,
  onToggleWishlist,
  onView,
  accentColor,
}: {
  product: Product;
  isDark: boolean;
  isLattie: boolean;
  isCentered: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onView: (productId: string) => void;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const primaryImage = product.images?.[0]?.image_url ?? "";
  const price = (product.price_in_cents / 100).toLocaleString();
  const conditionScore = conditionToScore(product.condition);
  const sellerName = product.seller?.shop_name || "Unknown Seller";
  const whatsapp = product.seller?.whatsapp_number;

  return (
    <div
      className="shrink-0"
      style={{ width: 380, transition: "all 0.3s ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-2xl overflow-hidden h-full flex flex-col"
        style={{
          background: isDark
            ? "rgba(14,14,24,0.85)"
            : isLattie
            ? "rgba(250,248,245,0.95)"
            : "rgba(255,255,255,0.95)",
          border: `1px solid ${isCentered ? accentColor + "60" : hovered ? accentColor + "55" : isDark ? "rgba(255,255,255,0.08)" : isLattie ? "rgba(196,181,253,0.25)" : "rgba(79,158,255,0.12)"}`,
          backdropFilter: "blur(16px)",
          boxShadow: isCentered
            ? `0 30px 60px -20px ${accentColor}`
            : hovered
            ? `0 24px 48px -16px ${accentColor}35`
            : isDark
            ? "0 2px 16px rgba(0,0,0,0.4)"
            : "0 2px 16px rgba(0,0,0,0.06)",
          transform: isCentered
            ? "translateY(-8px) scale(1.01)"
            : hovered
            ? "translateY(-4px)"
            : "translateY(0)",
          transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Image area */}
        <div
          className="relative overflow-hidden"
          style={{ height: 240, flexShrink: 0 }}
        >
          {primaryImage && !imgError ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{
                transform: hovered || isCentered ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                filter: isDark ? "brightness(0.85)" : "brightness(1)",
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: isDark
                  ? `linear-gradient(135deg, ${accentColor}15, rgba(14,14,24,0.9))`
                  : `linear-gradient(135deg, ${accentColor}10, rgba(248,249,255,0.9))`,
              }}
            >
              <div style={{ opacity: 0.2, color: accentColor }}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 4h16v2H4zm0 4h16v12H4zm2 2v8h12v-8zm3 2h2v4H9zm4 0h2v4h-2z" />
                </svg>
              </div>
            </div>
          )}

          {/* Category badge */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase"
            style={{
              background: isDark
                ? "rgba(0,0,0,0.7)"
                : "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}
          >
            {product.category?.name || "Gadget"}
          </div>

          {/* Verified seller badge */}
          {product.seller && (
            <div
              className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: isDark
                  ? "rgba(0,0,0,0.7)"
                  : "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(0,184,110,0.3)",
              }}
              title="Verified seller"
            >
              <Shield size={13} style={{ color: "#00B86E" }} />
            </div>
          )}

          {/* Wishlist heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isWishlisted
                ? "bg-red-500/20 text-red-500 shadow-lg shadow-red-500/20 heart-beat-active"
                : "bg-black/40 text-white hover:text-red-400 heart-pulse"
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3
            className="font-display font-bold text-xl mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {product.name}
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            {product.specs
              ? Object.values(product.specs).slice(0, 2).join(" · ")
              : ""}
          </p>
          <div className="flex items-center gap-2 mb-5">
            <ConditionDots score={conditionScore} accent={accentColor} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              {product.condition}
            </span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p
                className="font-display font-black text-2xl"
                style={{ color: "var(--color-text-primary)" }}
              >
                ₦{price}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {sellerName}
                </span>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-400 hover:text-green-300"
                    title="WhatsApp"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="..." />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(product.id);
              }}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: "var(--brand-gradient)",
                boxShadow: hovered
                  ? `0 8px 20px -8px ${accentColor}`
                  : "0 4px 12px -4px rgba(123,95,255,0.4)",
              }}
            >
              <Eye size={14} /> Details
            </button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: hovered || isCentered ? 0.8 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

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

export function FeaturedProducts() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { products, loading } = useAppSelector(
    (state: RootState) => state.product
  );
  const { items: wishlistItems } = useAppSelector(
    (state: RootState) => state.wishlist
  );
  const { sellers } = useAppSelector((state: RootState) => state.seller);
  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.user
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = mounted ? (resolvedTheme ?? "dark") : "dark";
  const isDark = currentTheme === "dark";
  const isLattie = currentTheme === "lattie";

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 50 }));
    dispatch(fetchActiveSellers({ page: 1, limit: 1000 }));
    if (isAuthenticated) dispatch(fetchMyWishlist({ page: 1, limit: 100 }));
  }, [dispatch, isAuthenticated]);

  const verifiedSellerIds = new Set<string>(
    sellers
      ?.filter((s) => s.verification_status === "VERIFIED")
      .map((s) => s.id) || []
  );
  const filteredProducts = products.filter((p) =>
    verifiedSellerIds.has(p.seller_id)
  );

  const cardsToShow = 3;
  const needCarousel = filteredProducts.length >= cardsToShow;
  const displayProducts = needCarousel
    ? [...filteredProducts, ...filteredProducts, ...filteredProducts]
    : filteredProducts;

  // Auto‑advance
  useEffect(() => {
    if (!needCarousel) return;
    const timer = setInterval(() => {
      if (!isTransitioning) goNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [needCarousel, currentIndex, isTransitioning]);

  const half = Math.floor(cardsToShow / 2);
  const centeredCardIndex = needCarousel ? currentIndex + half : -1;

  const goPrev = () => {
    if (!needCarousel || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };
  const goNext = () => {
    if (!needCarousel || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (!needCarousel) return;
    const len = filteredProducts.length;
    if (currentIndex < 0) setCurrentIndex(currentIndex + len);
    else if (currentIndex >= displayProducts.length - len)
      setCurrentIndex(currentIndex - len);
  };

  const wishlistedIds = new Set(wishlistItems.map((i) => i.product.id));
  const handleToggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (wishlistedIds.has(productId)) {
      dispatch(removeFromWishlistByProductId(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
  };
  const handleViewProduct = (id: string) => router.push(`/products/${id}`);

  const accentColors = ["#4F9EFF", "#7B5FFF", "#C4B5FD"];
  const cardWidth = 380 + 24;
  const offset = needCarousel ? -currentIndex * cardWidth : 0;

  const { ref: headRef, inView: headInView } = useInView(0.2);

  // ── NO EARLY RETURN – the component always renders the outer section ──
  return (
    <>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: isDark
            ? "#07070E"
            : isLattie
            ? "#ECE9E3"
            : "#F0F2FA",
          padding: "clamp(80px, 12vw, 140px) 0",
        }}
      >
        {/* Orbs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-15%",
              width: "clamp(300px, 50vw, 700px)",
              height: "clamp(300px, 50vw, 700px)",
              borderRadius: "50%",
              background: isDark
                ? "rgba(79,158,255,0.07)"
                : "rgba(123,95,255,0.05)",
              filter: "blur(100px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "-10%",
              width: "clamp(200px, 35vw, 500px)",
              height: "clamp(200px, 35vw, 500px)",
              borderRadius: "50%",
              background: isDark
                ? "rgba(196,181,253,0.06)"
                : "rgba(79,158,255,0.06)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Header */}
          <div
            ref={headRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "clamp(3rem, 6vw, 4rem)",
              opacity: headInView ? 1 : 0,
              transform: headInView
                ? "translateY(0)"
                : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 1rem",
                borderRadius: 9999,
                border: `1px solid ${isDark ? "rgba(123,95,255,0.2)" : "rgba(79,158,255,0.18)"}`,
                background: isDark
                  ? "rgba(123,95,255,0.08)"
                  : "rgba(79,158,255,0.06)",
                marginBottom: "1.5rem",
              }}
            >
              <Star
                size={12}
                style={{
                  color: isDark
                    ? "var(--brand-lavender)"
                    : "var(--brand-blue)",
                  fill: "currentColor",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isDark
                    ? "var(--brand-lavender)"
                    : "var(--brand-blue)",
                }}
              >
                Featured listings
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                lineHeight: 1.05,
                color: "var(--color-text-primary)",
                maxWidth: "36rem",
              }}
            >
              What&apos;s on Kurate
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                right now.
              </span>
            </h2>
            <div style={{ marginTop: "1.5rem" }}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-semibold"
                style={{
                  color: isDark
                    ? "var(--brand-lavender)"
                    : "var(--brand-blurple)",
                }}
              >
                See all products
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Content: loading / empty / products */}
          {loading ? (
            <TechLoader text="Loading featured gadgets…" />
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "var(--color-text-muted)",
              }}
            >
              No featured products from verified sellers yet.
            </div>
          ) : (
            <div style={{ position: "relative", marginBottom: "2rem" }}>
              {needCarousel && (
                <>
                  <button
                    onClick={goPrev}
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 20,
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: isDark
                        ? "rgba(20,20,30,0.9)"
                        : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={goNext}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 20,
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: isDark
                        ? "rgba(20,20,30,0.9)"
                        : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <div style={{ overflow: "hidden", padding: "0.5rem 0" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    transform: needCarousel
                      ? `translateX(${offset}px)`
                      : "none",
                    transition: isTransitioning
                      ? "transform 0.4s cubic-bezier(0.22,1,0.36,1)"
                      : "none",
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {(needCarousel ? displayProducts : filteredProducts).map(
                    (product, idx) => {
                      const isCentered =
                        needCarousel && idx === centeredCardIndex;
                      const accent =
                        accentColors[idx % accentColors.length];
                      return (
                        <div
                          key={`${product.id}-${idx}`}
                          style={{ flexShrink: 0, width: 380 }}
                        >
                          <ProductCard
                            product={product}
                            isDark={isDark}
                            isLattie={isLattie}
                            isCentered={isCentered}
                            isWishlisted={wishlistedIds.has(product.id)}
                            onToggleWishlist={handleToggleWishlist}
                            onView={handleViewProduct}
                            accentColor={accent}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div
            style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
                paddingTop: "1.5rem",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                opacity: headInView ? 1 : 0,
                transition: "opacity 0.7s ease 400ms",
              }}
            >
              {[
                {
                  value: `${filteredProducts.length}+`,
                  label: "Active listings",
                },
                {
                  value: `${verifiedSellerIds.size}+`,
                  label: "Verified sellers",
                },
                { value: "Free", label: "To browse" },
                { value: "1-tap", label: "WhatsApp contact" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-syne)",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      background:
                        "linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {stat.label}
                  </span>
                  {i < 3 && (
                    <div
                      style={{
                        width: 1,
                        height: "1.5rem",
                        background: "var(--color-border)",
                        marginLeft: "0.75rem",
                      }}
                      className="hidden sm:block"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <style jsx>{`
        .heart-pulse {
          animation: heartPulse 2s ease-in-out infinite;
        }
        .heart-beat-active {
          animation: heartBeatActive 1s ease-in-out infinite;
        }
        @keyframes heartPulse {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.12);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(0.96);
          }
        }
        @keyframes heartBeatActive {
          0%,
          100% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.15);
          }
          30% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
}