// app/products/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { fetchProducts } from "../redux/slices/productSlice";
import {
  fetchMyWishlist,
  addToWishlist,
  removeFromWishlistByProductId,
} from "../redux/slices/wishlistSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { fetchActiveSellers } from "../redux/slices/sellerSlice";
import { useThemeColors } from "../hooks/useThemeColors";
import { useInView } from "../hooks/useInView";
import {
  Search,
  Filter,
  Heart,
  ArrowLeft,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { AnimatedCard } from "../components/AnimatedCard";
import { TechLoader } from "../components/TechLoader";
import { AuthRequiredModal } from "../components/AuthRequiredModal";
import { Product, ProductImage } from "../types/product";

/* ─── Image Slider (public, with broken‑image fallback) ─────── */
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
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={() => {
            setBrokenUrls((prev) => new Set(prev).add(currentImage.image_url));
          }}
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

/* ─── Product Card ──────────────────────────────────────────── */
function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onView,
}: {
  product: Product & { _count?: { product_views?: number } };
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onView: (productId: string) => void;
}) {
  const { textPrimary, textSecondary, accent } = useThemeColors();
  const price = (product.price_in_cents / 100).toLocaleString();
  const viewCount = product._count?.product_views || 0;

  return (
    <AnimatedCard
      accentColor={accent}
      className="group/card transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
    >
      <div
        className="p-4 space-y-3 cursor-pointer"
        onClick={() => onView(product.id)}
      >
        <div className="relative">
          <CardImageSlider images={product.images} accent={accent} />
          <span
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm shadow-sm"
            style={{
              background: "rgba(15,15,20,0.75)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {product.condition}
          </span>
        </div>

        <div className="flex justify-between items-start gap-2">
          <h3
            className="font-semibold text-base line-clamp-1 flex-1"
            style={{ color: textPrimary }}
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
                ? "text-red-500 bg-red-500/10 shadow-sm shadow-red-500/10 heart-beat-active"
                : "text-gray-400 hover:text-red-400 heart-pulse"
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
          {viewCount > 0 && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "#9ca3af" }}
            >
              <Eye size={13} /> {viewCount}
            </span>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
}

/* ─── Main Page Component ───────────────────────────────────── */
export default function ProductsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    products,
    total,
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((state: RootState) => state.product);
  const { items: wishlistItems, loading: wishlistLoading } = useAppSelector(
    (state: RootState) => state.wishlist,
  );
  const { categories } = useAppSelector((state: RootState) => state.category);
  const { sellers } = useAppSelector((state: RootState) => state.seller);
  const { isAuthenticated } = useAppSelector((state: RootState) => state.user);
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } =
    useThemeColors();
  const { ref: headerRef, inView: headerInView } = useInView(0.2);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Debounce timer for price changes
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories and sellers once
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories({ page: 1, limit: 100 }));
    }
    dispatch(fetchActiveSellers({ page: 1, limit: 1000 }));
  }, [dispatch, categories.length]);

  // The actual fetch function
  const loadProducts = useCallback(() => {
    dispatch(
      fetchProducts({
        search: search || undefined,
        category_id: categoryId || undefined,
        condition: condition || undefined,
        min_price: minPrice !== "" ? (minPrice as number) : undefined,
        max_price: maxPrice !== "" ? (maxPrice as number) : undefined,
        page: 1,
        limit: 50,
      }),
    );
  }, [dispatch, search, categoryId, condition, minPrice, maxPrice]);

  // Debounce price inputs, otherwise fetch immediately
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (minPrice !== "" || maxPrice !== "") {
      debounceTimer.current = setTimeout(() => {
        loadProducts();
      }, 500);
    } else {
      loadProducts();
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [categoryId, condition, search, minPrice, maxPrice, loadProducts]);

  // Fetch wishlist only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyWishlist({ page: 1, limit: 100 }));
    }
  }, [dispatch, isAuthenticated]);

  // ── Build a Set of verified seller IDs ──────────────────
  const verifiedSellerIds = new Set<string>();
  if (sellers && sellers.length > 0) {
    sellers
      .filter((s) => s.verification_status === "VERIFIED")
      .forEach((s) => verifiedSellerIds.add(s.id));
  }

  const displayedProducts = products.filter((product) =>
    verifiedSellerIds.has(product.seller_id),
  );

  // Wishlist helpers with auth guard
  const wishlistedProductIds = new Set(
    wishlistItems.map((item) => item.product.id),
  );

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (wishlistedProductIds.has(productId)) {
      await dispatch(removeFromWishlistByProductId(productId));
    } else {
      await dispatch(addToWishlist(productId));
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // ── Loading state ─────────────────────────────────────
  if (productsLoading || wishlistLoading) {
    return <TechLoader text="Loading products…" />;
  }

  return (
    <main
      className="relative min-h-screen py-10 md:py-14 overflow-hidden"
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

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Back button */}
        <div className="mb-4 transition-all duration-700">
          <button
            onClick={handleBack}
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
          className="text-center mb-6 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4 relative inline-block"
            style={{ color: textPrimary }}
          >
            Explore <span style={{ color: accent }}>Gadgets</span>
            <span
              className="block w-24 h-1 rounded-full mx-auto mt-3"
              style={{ background: accent }}
            ></span>
          </h1>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{ color: textSecondary }}
          >
            Discover premium phones, laptops, PC setups and accessories from
            verified sellers.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: textMuted }}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20 transition"
                style={{ borderColor: border, color: textPrimary }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-xl border transition hover:bg-white/5"
              style={{ borderColor: border, color: accent }}
            >
              <Filter size={18} />
            </button>
          </div>

          {showFilters && (
            <div
              className="p-4 rounded-xl border flex flex-wrap gap-4 items-end"
              style={{ borderColor: border, background: bgSubtle }}
            >
              <div>
                <label
                  className="text-xs uppercase mb-1 block"
                  style={{ color: textMuted }}
                >
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{
                    borderColor: border,
                    color: textPrimary,
                    background: bgSubtle,
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-xs uppercase mb-1 block"
                  style={{ color: textMuted }}
                >
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{
                    borderColor: border,
                    color: textPrimary,
                    background: bgSubtle,
                  }}
                >
                  <option value="">All</option>
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                  <option value="REFURBISHED">Refurbished</option>
                </select>
              </div>
              <div>
                <label
                  className="text-xs uppercase mb-1 block"
                  style={{ color: textMuted }}
                >
                  Min Price (¢)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-24 px-3 py-2 rounded-lg border bg-surface text-sm"
                  style={{ borderColor: border, color: textPrimary }}
                />
              </div>
              <div>
                <label
                  className="text-xs uppercase mb-1 block"
                  style={{ color: textMuted }}
                >
                  Max Price (¢)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-24 px-3 py-2 rounded-lg border bg-surface text-sm"
                  style={{ borderColor: border, color: textPrimary }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product list */}
        {productsError ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              Failed to load products: {productsError}
            </p>
            <button
              onClick={loadProducts}
              className="mt-4 text-sm underline"
              style={{ color: accent }}
            >
              Try again
            </button>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag
              size={56}
              className="mx-auto opacity-25"
              style={{ color: textSecondary }}
            />
            <p className="mt-5 text-lg" style={{ color: textSecondary }}>
              No products found from verified sellers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistedProductIds.has(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onView={handleViewProduct}
              />
            ))}
          </div>
        )}

        {/* Moving gradient */}
        <div className="relative w-full h-px overflow-hidden mt-12">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      {/* Auth guard modal */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Dropdown readability */}
      <style jsx>{`
        select option {
          background: ${bgSubtle};
          color: ${textPrimary};
        }
      `}</style>

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
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line,
          .heart-pulse,
          .heart-beat-active {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}