// components/dashboard/EditProductModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Upload,
  LinkIcon,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Star,
} from "lucide-react";
import { Product, UpdateProductDto } from "../types/product";
import { useThemeColors } from "../hooks/useThemeColors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  updateProduct,
  addProductImage,
  deleteProductImage,
} from "../redux/slices/productSlice";
import { RootState } from "../redux/store";
import { TechLoader } from "../components/TechLoader";

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditProductModal({
  isOpen,
  product,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.product);
  const {
    textPrimary,
    textSecondary,
    textMuted,
    border,
    accent,
    bgSurface,
    bgSubtle,                          // 👈 added for solid select background
    success: successColor,
  } = useThemeColors();

  const [formData, setFormData] = useState<UpdateProductDto>({});
  const [existingImages, setExistingImages] = useState<Product["images"]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newImageEntries, setNewImageEntries] = useState<
    {
      id: string;
      file: File | null;
      url: string;
      alt_text: string;
      is_primary: boolean;
    }[]
  >([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name,
        description: product.description ?? "",
        price_in_cents: product.price_in_cents,
        condition: product.condition,
        stock_status: product.stock_status,
        specs: product.specs,
      });
      setExistingImages(product.images ?? []);
      setDeletedImageIds([]);
      setNewImageEntries([]);
      setSubmitError(null);
      setSuccess(false);
    }
  }, [product, isOpen]);

  const closeModal = () => {
    setSuccess(false);
    onClose();
  };

  const handleDeleteExistingImage = (imageId: string) => {
    const remaining = existingImages.filter((img) => img.id !== imageId);
    if (remaining.length === 0 && newImageEntries.length === 0) {
      setSubmitError("You must keep at least one image.");
      return;
    }
    setDeletedImageIds((prev) => [...prev, imageId]);
    setExistingImages(remaining);
  };

  const addNewImageEntry = () => {
    setNewImageEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        file: null,
        url: "",
        alt_text: "",
        is_primary: false,
      },
    ]);
  };

  const removeNewImageEntry = (id: string) => {
    setNewImageEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleFileChange = (id: string, file: File | null) => {
    setNewImageEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, file, url: file ? "" : e.url } : e,
      ),
    );
  };

  const handleUrlChange = (id: string, url: string) => {
    setNewImageEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, url, file: url ? null : e.file } : e,
      ),
    );
  };

  const handlePrimaryToggle = (id: string) => {
    setNewImageEntries((prev) =>
      prev.map((e) => ({ ...e, is_primary: e.id === id })),
    );
  };

  const handleAltTextChange = (id: string, alt_text: string) => {
    setNewImageEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, alt_text } : e)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const totalRemainingImages =
      existingImages.length +
      newImageEntries.filter((entry) => entry.file || entry.url).length;
    if (totalRemainingImages === 0) {
      setSubmitError("Product must have at least one image.");
      return;
    }

    setSaving(true);
    setSubmitError(null);
    try {
      // 1. Update text fields
      await dispatch(
        updateProduct({ id: product.id, data: formData }),
      ).unwrap();

      // 2. Delete marked images
      for (const imageId of deletedImageIds) {
        await dispatch(
          deleteProductImage({ productId: product.id, imageId }),
        ).unwrap();
      }

      // 3. Add new images
      for (const entry of newImageEntries) {
        if (entry.file || entry.url) {
          await dispatch(
            addProductImage({
              productId: product.id,
              data: {
                image_url: entry.url || "",
                alt_text: entry.alt_text,
                display_order: 0,
                is_primary: entry.is_primary || false,
              },
              file: entry.file || undefined,
            }),
          ).unwrap();
        }
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => closeModal(), 2000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={success ? undefined : closeModal}
      />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-scale-up"
        style={{ background: bgSurface, border: `1px solid ${border}` }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b flex justify-between items-center"
          style={{ background: bgSurface, borderColor: border }}
        >
          <h2 className="text-xl font-semibold" style={{ color: textPrimary }}>
            Edit Product
          </h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X size={20} style={{ color: textSecondary }} />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center space-y-3 animate-fade-in">
            <CheckCircle size={48} style={{ color: successColor }} />
            <p className="text-lg font-semibold" style={{ color: textPrimary }}>
              Product updated successfully!
            </p>
            <p className="text-xs mt-1" style={{ color: textMuted }}>
              Closing in 2 seconds...
            </p>
          </div>
        ) : saving ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <TechLoader text="Saving changes..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-7">
            {/* Basic Information */}
            <div className="space-y-5">
              <h3
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: textMuted }}
              >
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: border, color: textPrimary }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Price (in cents)
                  </label>
                  <input
                    type="number"
                    value={formData.price_in_cents ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_in_cents: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: border, color: textPrimary }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Condition
                  </label>
                  <select
                    value={formData.condition ?? "NEW"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        condition: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-primary/20"
                    style={{
                      borderColor: border,
                      color: textPrimary,
                      background: bgSubtle,   // 👈 solid background
                    }}
                  >
                    <option value="NEW">New</option>
                    <option value="USED">Used</option>
                    <option value="REFURBISHED">Refurbished</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Stock Status
                  </label>
                  <select
                    value={formData.stock_status ?? "IN_STOCK"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_status: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-primary/20"
                    style={{
                      borderColor: border,
                      color: textPrimary,
                      background: bgSubtle,   // 👈 solid background
                    }}
                  >
                    <option value="IN_STOCK">In Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                    <option value="LIMITED">Limited</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20"
                  style={{ borderColor: border, color: textPrimary }}
                />
              </div>
            </div>

            {/* Existing Images Gallery */}
            <div className="space-y-4">
              <h3
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: textMuted }}
              >
                Current Images
              </h3>
              {existingImages.length === 0 && (
                <p className="text-sm italic" style={{ color: textMuted }}>
                  No images yet.
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl overflow-hidden border"
                    style={{ borderColor: border }}
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || ""}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => handleDeleteExistingImage(img.id)}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                      title="Delete image"
                    >
                      <Trash2 size={16} />
                    </button>
                    {img.is_primary && (
                      <span className="absolute bottom-2 left-2 text-xs text-yellow-400 flex items-center gap-1">
                        <Star size={12} /> Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Images */}
            <div className="space-y-4">
              <h3
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: textMuted }}
              >
                Add New Images
              </h3>
              {newImageEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border"
                  style={{ borderColor: border }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className="text-sm font-medium"
                      style={{ color: textPrimary }}
                    >
                      New Image {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <label
                        className="text-xs flex items-center gap-1 cursor-pointer"
                        style={{ color: textSecondary }}
                      >
                        <input
                          type="radio"
                          name="new_primary"
                          checked={entry.is_primary}
                          onChange={() => handlePrimaryToggle(entry.id)}
                        />
                        Primary
                      </label>
                      <button
                        onClick={() => removeNewImageEntry(entry.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label
                        className="text-xs mb-1 block"
                        style={{ color: textSecondary }}
                      >
                        Upload file
                      </label>
                      <label
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-sm"
                        style={{ borderColor: border, color: textSecondary }}
                      >
                        <Upload size={16} style={{ color: accent }} />
                        {entry.file ? entry.file.name : "Choose file"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(
                              entry.id,
                              e.target.files?.[0] || null,
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        className="text-xs mb-1 block"
                        style={{ color: textSecondary }}
                      >
                        Or paste URL
                      </label>
                      <div className="flex items-center gap-2">
                        <LinkIcon size={16} style={{ color: textMuted }} />
                        <input
                          type="url"
                          value={entry.url}
                          onChange={(e) =>
                            handleUrlChange(entry.id, e.target.value)
                          }
                          className="flex-1 px-3 py-2 rounded-xl border bg-surface text-sm"
                          style={{ borderColor: border, color: textPrimary }}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="text-xs mb-1 block"
                        style={{ color: textSecondary }}
                      >
                        Alt text
                      </label>
                      <input
                        type="text"
                        value={entry.alt_text}
                        onChange={(e) =>
                          handleAltTextChange(entry.id, e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border bg-surface text-sm"
                        style={{ borderColor: border, color: textPrimary }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addNewImageEntry}
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                style={{ color: accent }}
              >
                <Plus size={16} /> Add another image
              </button>
            </div>

            {/* Error */}
            {submitError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                <AlertCircle size={18} />
                {submitError}
              </div>
            )}

            {/* Buttons */}
            <div
              className="flex gap-4 pt-3 border-t"
              style={{ borderColor: border }}
            >
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-5 py-3 rounded-xl border text-sm font-medium hover:bg-white/5"
                style={{ borderColor: border, color: textSecondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-md transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
      {/* Dropdown options styling */}
      <style jsx>{`
        select option {
          background: ${bgSubtle};
          color: ${textPrimary};
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.21, 1.11, 0.35, 1.1) forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}