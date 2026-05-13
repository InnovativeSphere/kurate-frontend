// components/UserManagementModal.tsx
"use client";

import { useState } from "react";
import { X, Shield, Mail, Calendar, Store, CheckCircle, RefreshCw, Trash2, AlertCircle } from "lucide-react";
import { useThemeColors } from "../hooks/useThemeColors";
import { User } from "../types/user";
import { useAppDispatch } from "../redux/hooks";
import { updateUserRole, deleteUserById, restoreUserById } from "../redux/slices/userSlice";
import { updateSellerVerification } from "../redux/slices/sellerSlice";
import { CgProfile } from "react-icons/cg";

interface UserManagementModalProps {
  user: User;
  seller?: any; // seller object from adminSellers list
  onClose: () => void;
  onUpdate: () => void; // refresh parent lists after changes
}

export function UserManagementModal({ user, seller, onClose, onUpdate }: UserManagementModalProps) {
  const dispatch = useAppDispatch();
  const { textPrimary, textSecondary, textMuted, border, accent, bgSurface, bgSubtle } = useThemeColors();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === user.role) return;
    setUpdating(true);
    setError(null);
    try {
      await dispatch(updateUserRole({ userId: user.id, role: newRole })).unwrap();
      onUpdate();
    } catch (err: any) {
      setError(err.message || "Failed to update role");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async () => {
    setUpdating(true);
    setError(null);
    try {
      if (user.deleted_at) {
        await dispatch(restoreUserById(user.id)).unwrap();
      } else {
        await dispatch(deleteUserById(user.id)).unwrap();
      }
      onUpdate();
    } catch (err: any) {
      setError(err.message || "Failed to update user status");
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifySeller = async () => {
    if (!seller) {
      setError("This user is not a seller.");
      return;
    }
    setUpdating(true);
    setError(null);
    try {
      await dispatch(updateSellerVerification({ sellerId: seller.id, data: { status: "VERIFIED" } })).unwrap();
      onUpdate();
    } catch (err: any) {
      setError(err.message || "Failed to verify seller");
    } finally {
      setUpdating(false);
    }
  };

  // Determine if the user is a seller (has a seller record)
  const isSeller = !!seller;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-scale-up"
        style={{ background: bgSurface, border: `1px solid ${border}` }}
      >
        {/* Header with moving gradient line */}
        <div className="relative">
          <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b" style={{ borderColor: border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                <Shield size={20} style={{ color: accent }} />
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: textPrimary }}>User Management</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} style={{ color: textSecondary }} />
            </button>
          </div>
          {/* Subtle moving gradient line under header */}
          <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
            <div className="moving-gradient-line w-full h-full" style={{ opacity: 0.6 }} />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-8">
          {/* User Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold" style={{ color: textMuted }}>
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: bgSubtle }}>
                <Mail size={18} style={{ color: accent }} />
                <div>
                  <p className="text-xs" style={{ color: textMuted }}>Email</p>
                  <p className="text-sm font-medium" style={{ color: textPrimary }}>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: bgSubtle }}>
                <CgProfile size={18} style={{ color: accent }} />
                <div>
                  <p className="text-xs" style={{ color: textMuted }}>Role</p>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    disabled={updating}
                    className="bg-transparent text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                    style={{ color: textPrimary }}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SELLER">Seller</option>
                    <option value="BUYER">Buyer</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: bgSubtle }}>
                <Calendar size={18} style={{ color: accent }} />
                <div>
                  <p className="text-xs" style={{ color: textMuted }}>Joined</p>
                  <p className="text-sm font-medium" style={{ color: textPrimary }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: bgSubtle }}>
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: user.deleted_at ? "#EF4444" : "#00B86E" }} />
                <div>
                  <p className="text-xs" style={{ color: textMuted }}>Status</p>
                  <p className="text-sm font-medium" style={{ color: user.deleted_at ? "#EF4444" : "#00B86E" }}>
                    {user.deleted_at ? "Disabled" : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Information Section (if applicable) */}
          {isSeller && (
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider font-semibold" style={{ color: textMuted }}>
                Seller Profile
              </h3>
              <div className="p-5 rounded-2xl" style={{ background: `${accent}08`, border: `1px solid ${border}` }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs" style={{ color: textMuted }}>Shop Name</p>
                    <p className="text-sm font-medium" style={{ color: textPrimary }}>{seller.shop_name}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: textMuted }}>Verification</p>
                    <p className="text-sm font-medium capitalize" style={{ color: seller.verification_status === "VERIFIED" ? "#00B86E" : "#F59E0B" }}>
                      {seller.verification_status.toLowerCase()}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs" style={{ color: textMuted }}>WhatsApp Number</p>
                    <p className="text-sm font-medium" style={{ color: textPrimary }}>{seller.whatsapp_number}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-3">
              {isSeller && (
                <button
                  onClick={handleVerifySeller}
                  disabled={updating || seller.verification_status === "VERIFIED"}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: `${accent}15`, color: accent }}
                >
                  <CheckCircle size={16} />
                  Verify Seller
                </button>
              )}
              <button
                onClick={handleToggleStatus}
                disabled={updating}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                  user.deleted_at
                    ? "bg-green-500/15 text-green-500 hover:bg-green-500/25"
                    : "bg-red-500/15 text-red-500 hover:bg-red-500/25"
                }`}
              >
                {user.deleted_at ? <RefreshCw size={16} /> : <Trash2 size={16} />}
                {user.deleted_at ? "Restore User" : "Disable User"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-white/5"
                style={{ borderColor: border, color: textSecondary }}
              >
                Close
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 p-3 rounded-xl bg-red-500/10">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Bottom moving gradient line (optional elegance) */}
        <div className="relative w-full h-px overflow-hidden">
          <div className="moving-gradient-line absolute inset-0" style={{ opacity: 0.5 }} />
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.21,1.11,0.35,1.1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .moving-gradient-line {
          background: linear-gradient(90deg, transparent, #4f9eff, #7b5fff, #c4b5fd, #7b5fff, #4f9eff, transparent);
          background-size: 200% 100%;
          animation: flowGradient 2s linear infinite;
        }
        @keyframes flowGradient { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      `}</style>
    </div>
  );
}