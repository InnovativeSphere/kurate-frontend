// components/seller/EditShopModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  LinkIcon,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useThemeColors } from '../hooks/useThemeColors';
import { RootState } from '../redux/store';
import { updateMyShop } from '../redux/slices/sellerSlice';
import { TechLoader } from '../components/TechLoader';   // 👈 added
import { Seller } from '../types/seller';

interface EditShopModalProps {
  isOpen: boolean;
  shop: Seller;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditShopModal({ isOpen, shop, onClose, onSuccess }: EditShopModalProps) {
  const dispatch = useAppDispatch();
  const { mutationLoading } = useAppSelector((state: RootState) => state.seller);
  const { textPrimary, textSecondary, textMuted, border, accent, bgSurface } = useThemeColors();

  const [formData, setFormData] = useState({
    shop_name: shop.shop_name,
    shop_description: shop.shop_description || '',
    location_text: shop.location_text || '',
    whatsapp_number: shop.whatsapp_number || '',
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const resetToForm = () => {
    setFormData({
      shop_name: shop.shop_name,
      shop_description: shop.shop_description || '',
      location_text: shop.location_text || '',
      whatsapp_number: shop.whatsapp_number || '',
    });
    setCertificateFile(null);
    setCertificateUrl('');
    setErrors({});
    setSubmitError(null);
    setSuccess(false);
    setFileUploaded(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetToForm();
    }
  }, [isOpen]);

  const closeModal = () => {
    setSuccess(false);
    onClose();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.shop_name.trim()) newErrors.shop_name = 'Shop name is required';
    if (!formData.whatsapp_number.trim()) newErrors.whatsapp_number = 'WhatsApp number is required';
    if (formData.whatsapp_number && !/^\+?[0-9]{10,15}$/.test(formData.whatsapp_number))
      newErrors.whatsapp_number = 'Invalid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCertificateFile(file);
    if (file) setCertificateUrl('');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCertificateUrl(url);
    if (url) setCertificateFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    const hadFile = !!certificateFile;
    setFileUploaded(hadFile);
    try {
      await dispatch(
        updateMyShop({
          data: {
            ...formData,
            business_certificate_url: certificateUrl || undefined,
          },
          certificateFile: certificateFile || undefined,
        })
      ).unwrap();

      onSuccess();
      setSuccess(true);

      setTimeout(() => closeModal(), 2000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update shop');
      setFileUploaded(false);
    }
  };

  if (!isOpen || !shop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={success ? undefined : closeModal}
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-scale-up"
        style={{ background: bgSurface, border: `1px solid ${border}` }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b flex justify-between items-center"
          style={{ background: bgSurface, borderColor: border }}
        >
          <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
            <Building2 size={20} style={{ color: accent }} />
            Edit Shop
          </h2>
          <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/10 transition">
            <X size={20} style={{ color: textSecondary }} />
          </button>
        </div>

        {/* Success screen */}
        {success ? (
          <div className="p-8 flex flex-col items-center space-y-3 animate-fade-in">
            <CheckCircle size={48} className="text-green-500" />
            <p className="text-lg font-semibold" style={{ color: textPrimary }}>
              Shop updated successfully!
            </p>
            {fileUploaded && (
              <p className="text-sm flex items-center gap-1 text-green-600">
                <CheckCircle size={16} />
                Certificate file uploaded
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: textMuted }}>
              Closing in 2 seconds...
            </p>
          </div>
        ) : mutationLoading ? (
          /* Saving overlay with TechLoader */
          <div className="p-12 flex flex-col items-center justify-center">
            <TechLoader text="Saving changes..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-7">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                Shop Name *
              </label>
              <input
                type="text"
                value={formData.shop_name}
                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20 transition"
                style={{ borderColor: errors.shop_name ? '#EF4444' : border, color: textPrimary }}
                placeholder="Your shop name"
              />
              {errors.shop_name && <p className="text-red-500 text-xs mt-1">{errors.shop_name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                Description
              </label>
              <textarea
                rows={4}
                value={formData.shop_description}
                onChange={(e) => setFormData({ ...formData, shop_description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20 transition"
                style={{ borderColor: border, color: textPrimary }}
                placeholder="Tell customers about your shop..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                Location
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textMuted }} />
                <input
                  type="text"
                  value={formData.location_text}
                  onChange={(e) => setFormData({ ...formData, location_text: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20 transition"
                  style={{ borderColor: border, color: textPrimary }}
                  placeholder="Ikeja, Lagos"
                />
              </div>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                WhatsApp Number *
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textMuted }} />
                <input
                  type="tel"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20 transition"
                  style={{ borderColor: errors.whatsapp_number ? '#EF4444' : border, color: textPrimary }}
                  placeholder="+2348012345678"
                />
              </div>
              {errors.whatsapp_number && <p className="text-red-500 text-xs mt-1">{errors.whatsapp_number}</p>}
            </div>

            {/* Business Certificate – dual input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                Business Certificate
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer hover:bg-white/5 transition"
                    style={{ borderColor: border }}
                  >
                    <Upload size={18} style={{ color: accent }} />
                    <span className="text-sm" style={{ color: textSecondary }}>
                      {certificateFile ? certificateFile.name : 'Upload File'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {certificateFile && (
                    <button
                      type="button"
                      onClick={() => setCertificateFile(null)}
                      className="text-sm text-red-500 hover:text-red-600 transition"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <LinkIcon size={18} style={{ color: textMuted }} />
                  <input
                    type="url"
                    value={certificateUrl}
                    onChange={handleUrlChange}
                    placeholder="Or paste a URL (e.g., https://...)"
                    className="flex-1 px-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20 transition"
                    style={{ borderColor: border, color: textPrimary }}
                  />
                  {certificateUrl && (
                    <button
                      type="button"
                      onClick={() => setCertificateUrl('')}
                      className="text-sm text-red-500 hover:text-red-600 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                <AlertCircle size={18} />
                {submitError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-5 py-3 rounded-xl border text-sm font-medium hover:bg-white/5 transition"
                style={{ borderColor: border, color: textSecondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutationLoading}
                className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-md transition-all disabled:opacity-50"
              >
                {mutationLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
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