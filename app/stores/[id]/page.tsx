// app/stores/[id]/page.tsx
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";
import {
  fetchMyWishlist,
  addToWishlist,
  removeFromWishlistByProductId,
} from "../../redux/slices/wishlistSlice";
import { useThemeColors } from "../../hooks/useThemeColors";
import { TechLoader } from "../../components/TechLoader";
import { AuthRequiredModal } from "../../components/AuthRequiredModal";
import { AnimatedCard } from "../../components/AnimatedCard";
import { ShareableLink } from "../../components/ShareableLink";
import {
  ArrowLeft,
  Store,
  BadgeCheck,
  MapPin,
  Phone,
  Heart,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  Layers,
} from "lucide-react";
import type { Product, ProductImage } from "../../types/product";
import type { Seller } from "../../types/seller";

/* ─── in‑view hook (optional, not used for header) ─── */
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

/* ─── Image slider (unchanged) ──────────────────── */
function CardImageSlider({
  images,
  accent,
}: {
  images: ProductImage[];
  accent?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-48 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <ShoppingBag size={48} className="opacity-30" />
      </div>
    );
  }

  const currentImage = images[current];
  const isBroken = brokenUrls.has(currentImage.image_url);

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden group">
      {isBroken ? (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <ShoppingBag size={48} className="opacity-30" />
        </div>
      ) : (
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text ?? ""}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() =>
            setBrokenUrls((prev) => new Set(prev).add(currentImage.image_url))
          }
        />
      )}
      {images.length > 1 && !isBroken && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((prev) => (prev - 1 + images.length) % images.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((prev) => (prev + 1) % images.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Product Card (unchanged) ──────────────────── */
function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onView,
  accent,
}: {
  product: Product & { _count?: { product_views?: number } };
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onView: (productId: string) => void;
  accent: string;
}) {
  const { textPrimary, textSecondary, textMuted } = useThemeColors();
  const price = (product.price_in_cents / 100).toLocaleString();
  const sellerWhatsApp = product.seller?.whatsapp_number;
  const prefillMessage = encodeURIComponent(
    `Hi, I'm interested in "${product.name}" on Kurate. Is it still available?`
  );

  return (
    <AnimatedCard
      accentColor={accent}
      className="group/card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="p-4 space-y-3">
        <div className="relative cursor-pointer" onClick={() => onView(product.id)}>
          <CardImageSlider images={product.images} accent={accent} />
          <span
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm shadow-sm"
            style={{
              background: "rgba(15,15,20,0.75)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {product.condition}
          </span>
        </div>

        <div className="flex justify-between items-start gap-2">
          <h3
            className="font-semibold text-base line-clamp-1 flex-1 cursor-pointer hover:underline"
            style={{ color: textPrimary }}
            onClick={() => onView(product.id)}
          >
            {product.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-1.5 rounded-full transition-all duration-300 ${
              isWishlisted
                ? "text-red-500 bg-red-500/10 heart-beat-active"
                : "text-gray-400 hover:text-red-400 hover:bg-red-500/5"
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: textPrimary }}>
            ₦{price}
          </span>
          {sellerWhatsApp && (
            <a
              href={`https://wa.me/${sellerWhatsApp.replace(/\D/g, "")}?text=${prefillMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={14} /> WhatsApp
            </a>
          )}
        </div>

        <div className="pt-1">
          <ShareableLink productId={product.id} productName={product.name} />
        </div>
      </div>
    </AnimatedCard>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function StoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const dispatch = useAppDispatch();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((s: RootState) => s.product);
  const { items: wishlistItems } = useAppSelector((s: RootState) => s.wishlist);
  const { isAuthenticated } = useAppSelector((s: RootState) => s.user);

  const [sellerData, setSellerData] = useState<Seller | null>(null);
  const [sellerLoading, setSellerLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const {
    textPrimary,
    textSecondary,
    textMuted,
    border,
    accent,
    bgSubtle,
  } = useThemeColors();

  useEffect(() => {
    if (!storeId) return;
    setSellerLoading(true);
    import("../../services/sellerApi").then(({ sellerApi }) => {
      sellerApi
        .getSellerById(storeId)
        .then((res) => {
          setSellerData(res.data);
          setSellerLoading(false);
        })
        .catch(() => setSellerLoading(false));
    });
    dispatch(fetchProducts({ seller_id: storeId, page: 1, limit: 50 }));
    if (isAuthenticated) {
      dispatch(fetchMyWishlist({ page: 1, limit: 100 }));
    }
  }, [storeId, dispatch, isAuthenticated]);

  const wishlistedIds = new Set(wishlistItems.map((i) => i.product.id));

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (wishlistedIds.has(productId)) {
      await dispatch(removeFromWishlistByProductId(productId));
    } else {
      await dispatch(addToWishlist(productId));
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.condition?.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  if (sellerLoading || productsLoading) return <TechLoader text="Loading store…" />;
  if (!sellerData) {
    return (
      <main className="flex items-center justify-center min-h-screen" style={{ background: bgSubtle }}>
        <div className="text-center">
          <Store size={48} className="mx-auto text-muted opacity-30" />
          <p className="mt-4 text-muted">Store not found.</p>
          <button
            onClick={() => router.push("/stores")}
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary underline"
          >
            <ArrowLeft size={16} /> Back to stores
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen py-16 md:py-24 overflow-hidden"
      style={{ background: bgSubtle }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-15%] left-[-10%] w-[clamp(300px,40vw,500px)] h-[clamp(300px,40vw,500px)] rounded-full blur-[80px] opacity-10"
          style={{ background: accent }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[clamp(250px,35vw,450px)] h-[clamp(250px,35vw,450px)] rounded-full blur-[70px] opacity-10"
          style={{ background: accent }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 mb-8 transition-opacity"
          style={{ color: textSecondary }}
        >
          <ArrowLeft size={16} /> Back to stores
        </button>

        {/* ─── Store info card (ALWAYS VISIBLE, no animation) ─── */}
        <div className="mb-12 text-center">
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl backdrop-blur-sm shadow-sm"
            style={{
              background: "var(--card-bg, rgba(255,255,255,0.6))",
              border: `1px solid ${border}`,
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--primary-subtle, #eef2ff)" }}
            >
              <Store size={36} className="text-primary" />
            </div>
            <div className="text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold" style={{ color: textPrimary }}>
                  {sellerData.shop_name}
                </h1>
                {sellerData.verification_status === "VERIFIED" && (
                  <BadgeCheck size={24} className="text-green-500" />
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: textSecondary }}>
                {sellerData.location_text && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {sellerData.location_text}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {sellerData.whatsapp_number}
                </span>
              </div>
              {sellerData.shop_description && (
                <p className="text-sm leading-relaxed mt-2 max-w-lg" style={{ color: textSecondary }}>
                  {sellerData.shop_description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Search bar ─── */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search products by name, description, condition…"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* ─── Products heading with design upgrade ─── */}
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
            <Layers size={18} className="text-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Products
            </span>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full" />
          <p className="mt-2 text-xs text-muted">
            {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {/* ─── Products grid ─── */}
        {productsError ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-red-400/50" />
            <p className="mt-4 text-red-500">Failed to load products.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto opacity-30" style={{ color: textSecondary }} />
            <p className="mt-4" style={{ color: textSecondary }}>
              {products.length === 0 ? "No products listed yet." : "No products match your search."}
            </p>
            {products.length > 0 && (
              <button
                onClick={() => setProductSearch("")}
                className="mt-2 text-sm text-primary underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistedIds.has(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onView={handleViewProduct}
                accent={accent}
              />
            ))}
          </div>
        )}

        {/* Decorative moving gradient line */}
        <div className="relative w-full h-px overflow-hidden mt-16">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      <AuthRequiredModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <style jsx global>{`
        :root {
          --card-bg: rgba(255, 255, 255, 0.6);
          --color-border: rgba(0,0,0,0.08);
          --primary-subtle: #eef2ff;
        }
        .dark {
          --card-bg: rgba(20,18,35,0.8);
          --color-border: rgba(255,255,255,0.08);
          --primary-subtle: rgba(123,95,255,0.1);
        }
        .lattie {
          --card-bg: rgba(252,250,247,0.9);
          --color-border: rgba(196,181,253,0.2);
          --primary-subtle: rgba(196,181,253,0.1);
        }
        .moving-gradient-line {
          background: linear-gradient(90deg, transparent, #4f9eff, #7b5fff, #c4b5fd, #7b5fff, #4f9eff, transparent);
          background-size: 200% 100%;
          animation: flowGradient 3s linear infinite;
          opacity: 0.6;
        }
        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .heart-pulse { animation: heartPulse 2s ease-in-out infinite; }
        .heart-beat-active { animation: heartBeatActive 1s ease-in-out infinite; }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.12); }
          50% { transform: scale(1); }
          75% { transform: scale(0.96); }
        }
        @keyframes heartBeatActive {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line { animation: none; }
          .heart-pulse, .heart-beat-active { animation: none; }
        }
      `}</style>
    </main>
  );
}