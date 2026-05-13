// components/dashboard/ProductDetailModal.tsx
'use client';

import { useEffect } from 'react';
import { X, Eye, Calendar, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchProductAnalytics } from '../redux/slices/analyticsSlice';
import { RootState } from '../redux/store';
import { useThemeColors } from '../hooks/useThemeColors';
import { ShareableLink } from '../components/ShareableLink';
import { AnimatedCard } from '../components/AnimatedCard';
import { TechLoader } from '../components/TechLoader';   // ← new import

interface ProductDetailModalProps {
  isOpen: boolean;
  productId: string | null;
  productName?: string;
  onClose: () => void;
}

export function ProductDetailModal({ isOpen, productId, productName, onClose }: ProductDetailModalProps) {
  const dispatch = useAppDispatch();
  const { currentProductAnalytics, currentProductAnalyticsLoading } = useAppSelector((state: RootState) => state.analytics);
  const { bgSurface, border, textPrimary, textSecondary, textMuted, accent } = useThemeColors();

  useEffect(() => {
    if (isOpen && productId) {
      dispatch(fetchProductAnalytics(productId));
    }
  }, [isOpen, productId, dispatch]);

  if (!isOpen || !productId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl animate-scale-up"
        style={{ background: bgSurface, border: `1px solid ${border}` }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10">
          <X size={18} style={{ color: textSecondary }} />
        </button>

        <h3 className="text-xl font-semibold mb-1" style={{ color: textPrimary }}>{productName || 'Product Details'}</h3>
        <ShareableLink productId={productId} productName={productName} />

        {currentProductAnalyticsLoading ? (
          <TechLoader text="Loading analytics..." />           // ← replaced inline text
        ) : currentProductAnalytics ? (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <Eye size={20} className="mx-auto mb-1" style={{ color: accent }} />
                <p className="text-2xl font-bold">{currentProductAnalytics.total_views}</p>
                <p className="text-xs" style={{ color: textMuted }}>Total Views</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <TrendingUp size={20} className="mx-auto mb-1" style={{ color: accent }} />
                <p className="text-2xl font-bold">{currentProductAnalytics.views_this_week}</p>
                <p className="text-xs" style={{ color: textMuted }}>Last 7 Days</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <Calendar size={20} className="mx-auto mb-1" style={{ color: accent }} />
                <p className="text-2xl font-bold">{currentProductAnalytics.views_this_month}</p>
                <p className="text-xs" style={{ color: textMuted }}>Last 30 Days</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <Eye size={20} className="mx-auto mb-1" style={{ color: accent }} />
                <p className="text-sm font-medium">{currentProductAnalytics.last_viewed_at ? new Date(currentProductAnalytics.last_viewed_at).toLocaleDateString() : 'Never'}</p>
                <p className="text-xs" style={{ color: textMuted }}>Last Viewed</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">No analytics data available.</div>
        )}
      </div>
    </div>
  );
}