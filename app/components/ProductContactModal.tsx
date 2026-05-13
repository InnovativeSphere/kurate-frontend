// components/ProductContactModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';

interface ProductContactModalProps {
  productId: string;
  productName: string;
  sellerWhatsApp?: string;
  onClose: () => void;
}

export function ProductContactModal({ productId, productName, sellerWhatsApp, onClose }: ProductContactModalProps) {
  const { bgSurface, border, textPrimary, textSecondary } = useThemeColors();
  const [whatsappNumber, setWhatsappNumber] = useState(sellerWhatsApp || '2341234567890'); // fallback

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const message = `Hi! I'm interested in ${productName} on Kurate. Is it still available?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative max-w-md w-full rounded-2xl p-6 shadow-2xl animate-scale-up"
        style={{ background: bgSurface, border: `1px solid ${border}` }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10">
          <X size={18} style={{ color: textSecondary }} />
        </button>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <MessageCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold" style={{ color: textPrimary }}>Contact Seller</h3>
          <p className="text-sm" style={{ color: textSecondary }}>
            You will be redirected to WhatsApp to chat with the seller about <strong>{productName}</strong>.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <MessageCircle size={18} />
            Open WhatsApp
          </a>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
            style={{ borderColor: border, color: textSecondary }}
          >
            Cancel
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.21,1.11,0.35,1.1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}