// components/ShopRequiredGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { fetchMyShop } from '../redux/slices/sellerSlice';
import { CreateShopModal } from './CreateShopModal';
import { useThemeColors } from '../hooks/useThemeColors';

interface ShopRequiredGuardProps {
  children: React.ReactNode;
}

export function ShopRequiredGuard({ children }: ShopRequiredGuardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { myShop, myShopLoading } = useAppSelector((state) => state.seller);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { bgSubtle, textSecondary } = useThemeColors();

  const isSeller = user?.role === 'SELLER';

  useEffect(() => {
    if (isSeller && !myShop && !myShopLoading) {
      dispatch(fetchMyShop());
    }
  }, [isSeller, myShop, myShopLoading, dispatch]);

  useEffect(() => {
    if (isSeller && !myShopLoading && !myShop) {
      setShowCreateModal(true);
    } else {
      setShowCreateModal(false);
    }
  }, [isSeller, myShop, myShopLoading]);

  // If not a seller, render children directly
  if (!isSeller) return <>{children}</>;

  // Loading or no shop yet
  if (myShopLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" style={{ background: bgSubtle }}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p style={{ color: textSecondary }}>Loading shop info...</p>
        </div>
      </div>
    );
  }

  // Shop exists → render children
  if (myShop) return <>{children}</>;

  // No shop → show create modal and block content
  return (
    <>
      <CreateShopModal
        isOpen={showCreateModal}
        onClose={() => {}} // cannot close until shop created
        onSuccess={() => {
          setShowCreateModal(false);
          window.location.reload(); // or re‑fetch dashboard data
        }}
      />
      <div className="flex items-center justify-center min-h-[60vh]" style={{ background: bgSubtle }}>
        <div className="text-center space-y-4">
          <p style={{ color: textSecondary }}>You need to create a shop to access the seller dashboard.</p>
        </div>
      </div>
    </>
  );
}