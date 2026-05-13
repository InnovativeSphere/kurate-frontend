// components/dashboard/SellerProductsGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Edit,
  Eye,
  Trash2,
  Package,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { Product, ProductImage } from '../types/product';
import { AnimatedCard } from '../components/AnimatedCard';
import { TechLoader } from '../components/TechLoader';                 // 👈 added
import { ConfirmationModal } from '../components/ConfirmationModal';

/* ──────────────────────────────────────────────
   Image Slider (6 s auto‑rotation, manual arrows)
   ────────────────────────────────────────────── */
function ImageSlider({ images }: { images: ProductImage[] }) {
  const [current, setCurrent] = useState(0);
  const { accent } = useThemeColors();

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="w-full h-48 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <ShoppingBag size={48} className="opacity-30" />
      </div>
    );
  }

  const currentImage = images[current];

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden group">
      <img
        src={currentImage.image_url}
        alt={currentImage.alt_text ?? ''}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((prev) => (prev - 1 + images.length) % images.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((prev) => (prev + 1) % images.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Grid component
   ────────────────────────────────────────────── */
interface SellerProductsGridProps {
  products: Product[];
  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  loading?: boolean;
}

export function SellerProductsGrid({
  products,
  onView,
  onEdit,
  onDelete,
  loading,
}: SellerProductsGridProps) {
  const { textPrimary, textSecondary, accent, border } = useThemeColors();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      onDelete(selectedProductId);
      setDeleteConfirmOpen(false);
      setSelectedProductId(null);
    }
  };

  // ── Loading state with TechLoader ─────────────────
  if (loading) {
    return <TechLoader text="Loading your products…" />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={56} className="mx-auto opacity-25" style={{ color: textSecondary }} />
        <p className="mt-5 text-lg" style={{ color: textSecondary }}>
          You haven't listed any products yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const price = (product.price_in_cents / 100).toLocaleString();

          return (
            <AnimatedCard key={product.id} accentColor={accent}>
              <div className="p-5 space-y-4">
                <ImageSlider images={product.images} />

                <div className="flex justify-between items-start gap-3">
                  <h3
                    className="font-semibold text-lg line-clamp-1 flex-1"
                    style={{ color: textPrimary }}
                  >
                    {product.name}
                  </h3>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    {product.condition}
                  </span>
                </div>

                {product.description && (
                  <p className="text-sm line-clamp-2" style={{ color: textSecondary }}>
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold" style={{ color: textPrimary }}>
                    ₦{price}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onView(product.id)}
                      className="p-2 rounded-lg transition-all hover:bg-white/10"
                      title="View details"
                    >
                      <Eye size={16} style={{ color: textSecondary }} />
                    </button>
                    <button
                      onClick={() => onEdit(product.id)}
                      className="p-2 rounded-lg transition-all hover:bg-white/10"
                      title="Edit product"
                    >
                      <Edit size={16} style={{ color: textSecondary }} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                      title="Delete product"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          );
        })}
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDanger
      />
    </>
  );
}