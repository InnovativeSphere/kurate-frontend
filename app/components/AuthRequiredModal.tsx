// components/AuthRequiredModal.tsx
"use client";

import { useRouter } from "next/navigation";
import { X, LogIn } from "lucide-react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-scale-up bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X size={18} className="text-gray-500 dark:text-gray-400" />
        </button>

        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <LogIn size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Login Required
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You need to be logged in to add items to your wishlist.
          </p>
          <button
            onClick={() => {
              router.push("/login");
              onClose();
            }}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}