// components/ConfirmationModal.tsx
'use client';

import { X, AlertTriangle } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
}: ConfirmationModalProps) {
  const { bgSurface, border, textPrimary, textSecondary } = useThemeColors();

  if (!isOpen) return null;

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
        <div className="flex flex-col items-center text-center mb-4">
          {isDanger && <AlertTriangle size={32} className="text-red-500 mb-2" />}
          <h3 className="text-xl font-semibold" style={{ color: textPrimary }}>{title}</h3>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>{message}</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
            style={{ borderColor: border, color: textPrimary }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isDanger
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-md'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}