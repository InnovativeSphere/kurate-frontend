// app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchProductById } from "../../redux/slices/productSlice";
import {
  fetchMyWishlist,
  addToWishlist,
  removeFromWishlistByProductId,
} from "../../redux/slices/wishlistSlice";
import { TechLoader } from "../../components/TechLoader";                   // 👈 loader
import { AuthRequiredModal } from "../../components/AuthRequiredModal";     // 👈 auth guard
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Package,
  MapPin,
  Phone,
  BadgeCheck,
  Info,
  Layers,
  HardDrive,
  Cpu,
  Monitor,
  Camera,
  Battery,
  Wifi,
  Bluetooth,
  Weight,
  Palette,
  Smartphone,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { AnimatedCard } from "../../components/AnimatedCard";

/* ─── Icon mapping for specs ──────────────────────────── */
const specIcons: Record<string, any> = {
  brand: Smartphone,
  model: Smartphone,
  storage: HardDrive,
  ram: Cpu,
  processor: Cpu,
  gpu: Monitor,
  display: Monitor,
  camera: Camera,
  battery: Battery,
  os: Zap,
  os_version: Zap,
  weight: Weight,
  color: Palette,
  connectivity: Wifi,
  sim: Wifi,
  bluetooth: Bluetooth,
  screen_size: Monitor,
  resolution: Monitor,
  refresh_rate: Monitor,
  ports: Cpu,
  warranty: () => <Info size={16} />,
};

const getSpecIcon = (key: string) => {
  const cleanKey = key.toLowerCase().replace(/[_\s]/g, "");
  for (const [k, icon] of Object.entries(specIcons)) {
    if (cleanKey.includes(k)) return icon;
  }
  return Info;
};

const buildWhatsAppUrl = (phone: string, productName: string) => {
  const message = `Hi, I'm interested in your product: "${productName}" on Kurate. Is it still available?`;
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const dispatch = useAppDispatch();

  const { currentProduct, currentProductLoading, error } = useAppSelector(
    (state: RootState) => state.product
  );
  const { items: wishlistItems } = useAppSelector(
    (state: RootState) => state.wishlist
  );
  const { isAuthenticated } = useAppSelector((state: RootState) => state.user); // 👈 auth state
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } =
    useThemeColors();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);   // 👈 auth modal state

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
      // only fetch wishlist if authenticated
      if (isAuthenticated) {
        dispatch(fetchMyWishlist({ page: 1, limit: 100 }));
      }
    }
  }, [dispatch, productId, isAuthenticated]);

  const product = currentProduct;
  const isWishlisted = wishlistItems.some(
    (item) => item.product.id === productId
  );
  const price = product
    ? (product.price_in_cents / 100).toLocaleString()
    : "0";
  const images =
    product?.images?.sort((a, b) => a.display_order - b.display_order) || [];
  const specs = product?.specs ? Object.entries(product.specs) : [];

  const handleToggleWishlist = () => {
    if (!product) return;
    if (!isAuthenticated) {
      setAuthModalOpen(true);   // 👈 show login modal
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlistByProductId(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  // ── Loading state ──────────────────────────────────
  if (currentProductLoading) {
    return <TechLoader text="Loading product details..." />;
  }

  // ── Error state ────────────────────────────────────
  if (error || !product) {
    return (
      <main
        className="relative min-h-screen py-16 md:py-24 overflow-hidden"
        style={{ background: bgSubtle }}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-16 text-center">
          <p className="text-red-500">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center gap-2 text-sm"
            style={{ color: accent }}
          >
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </main>
    );
  }

  // ── Product detail view ────────────────────────────
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

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-all group opacity-70 hover:opacity-100"
          style={{ color: textSecondary }}
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="group-hover:text-primary transition-colors">
            Back to products
          </span>
        </button>

        {/* Product content – fade in on mount */}
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="relative rounded-2xl overflow-hidden border"
                style={{ borderColor: border }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex].image_url}
                    alt={images[selectedImageIndex].alt_text || product.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <ShoppingBag size={64} className="opacity-30" />
                  </div>
                )}
                <button
                  onClick={handleToggleWishlist}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
                    isWishlisted
                      ? "bg-red-500/20 text-red-500 shadow-lg shadow-red-500/20 heart-beat-active"
                      : "bg-black/40 text-white hover:text-red-400 heart-pulse"
                  }`}
                >
                  <Heart
                    size={24}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        idx === selectedImageIndex
                          ? "border-primary shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={img.alt_text || ""}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1
                    className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl"
                    style={{ color: textPrimary }}
                  >
                    {product.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                    style={{
                      background: "rgba(15,15,20,0.75)",
                      color: "#fff",
                    }}
                  >
                    {product.condition}
                  </span>
                  <StockStatusBadge status={product.stock_status} />
                  {product.category && (
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ background: `${accent}15`, color: accent }}
                    >
                      {product.category.name}
                    </span>
                  )}
                </div>
                <p
                  className="text-4xl font-bold mt-4"
                  style={{ color: textPrimary }}
                >
                  ₦{price}
                </p>
              </div>

              {product.description && (
                <div>
                  <h3
                    className="text-sm uppercase tracking-wider font-semibold mb-2 flex items-center gap-2"
                    style={{ color: textMuted }}
                  >
                    <Info size={16} /> Description
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: textSecondary }}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {specs.length > 0 && (
                <div>
                  <h3
                    className="text-sm uppercase tracking-wider font-semibold mb-3 flex items-center gap-2"
                    style={{ color: textMuted }}
                  >
                    <Layers size={16} /> Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specs.map(([key, value]) => {
                      const Icon = getSpecIcon(key);
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-3 p-3 rounded-xl border"
                          style={{
                            borderColor: border,
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <Icon size={18} style={{ color: accent }} />
                          <div>
                            <p
                              className="text-xs capitalize"
                              style={{ color: textMuted }}
                            >
                              {key.replace(/_/g, " ")}
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: textPrimary }}
                            >
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seller Card & Contact */}
          <AnimatedCard accentColor={accent} className="mb-16">
            <div className="p-6 sm:p-8 space-y-5">
              <h2
                className="text-xl font-semibold flex items-center gap-2"
                style={{ color: textPrimary }}
              >
                <BadgeCheck size={24} style={{ color: accent }} />
                About the Seller
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: textPrimary }}
                  >
                    {product.seller?.shop_name || "Unknown Shop"}
                  </p>
                </div>
                <div className="sm:text-right">
                  {product.seller?.whatsapp_number ? (
                    <a
                      href={buildWhatsAppUrl(
                        product.seller.whatsapp_number,
                        product.name
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all hover:scale-105"
                    >
                      <Phone size={18} /> Contact Seller via WhatsApp
                    </a>
                  ) : (
                    <p
                      className="text-sm"
                      style={{ color: textSecondary }}
                    >
                      No WhatsApp provided
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Moving gradient */}
        <div className="relative w-full h-px overflow-hidden mt-16">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      {/* Auth guard modal */}
      <AuthRequiredModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Global animations */}
      <style jsx global>{`
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
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.98); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 25px) scale(1.04); }
        }
        .heart-pulse {
          animation: heartPulse 2s ease-in-out infinite;
        }
        .heart-beat-active {
          animation: heartBeatActive 1s ease-in-out infinite;
        }
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
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line,
          .heart-pulse,
          .heart-beat-active,
          .orb-1,
          .orb-2,
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

function StockStatusBadge({ status }: { status?: string }) {
  switch (status) {
    case "IN_STOCK":
      return (
        <span className="inline-flex items-center gap-1 text-sm text-green-400">
          <CheckCircle size={14} /> In Stock
        </span>
      );
    case "OUT_OF_STOCK":
      return (
        <span className="inline-flex items-center gap-1 text-sm text-red-400">
          <XCircle size={14} /> Out of Stock
        </span>
      );
    case "LIMITED":
      return (
        <span className="inline-flex items-center gap-1 text-sm text-yellow-400">
          <AlertTriangle size={14} /> Limited Stock
        </span>
      );
    default:
      return null;
  }
}