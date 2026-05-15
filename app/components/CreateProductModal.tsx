// components/CreateProductModal.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2, Upload, LinkIcon, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createProduct } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { useThemeColors } from "../hooks/useThemeColors";
import { TechLoader } from "../components/TechLoader";
import type { ProductImageFile } from "../types/product";

const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  price_in_naira: z
    .number({ error: "Price must be a number" })
    .min(1, "Price must be greater than 0"),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  stock_status: z.enum(["IN_STOCK", "OUT_OF_STOCK", "LIMITED"]).optional(),
  specs: z.record(z.string(), z.any()).optional(),
  category_id: z.string().uuid("Select a category"),
});
type ProductFormData = z.infer<typeof productSchema>;

interface ImageEntry {
  id: string;
  file: File | null;
  url: string;
  alt_text: string;
  is_primary: boolean;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state: any) => state.category);
  const { loading: creating } = useAppSelector((state: any) => state.product);
  const {
    textPrimary,
    textSecondary,
    textMuted,
    border,
    accent,
    bgSurface,
    bgSubtle,
    success: successColor,
  } = useThemeColors();

  const [specsString, setSpecsString] = useState("");
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([
    {
      id: crypto.randomUUID(),
      file: null,
      url: "",
      alt_text: "",
      is_primary: true,
    },
  ]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdProductData, setCreatedProductData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      condition: "NEW",
      stock_status: "IN_STOCK",
      specs: {},
    },
  });

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      dispatch(fetchCategories({ page: 1, limit: 100 }));
    }
  }, [isOpen, categories.length, dispatch]);

  const closeModal = () => {
    reset();
    setSpecsString("");
    setImageEntries([
      {
        id: crypto.randomUUID(),
        file: null,
        url: "",
        alt_text: "",
        is_primary: true,
      },
    ]);
    setSubmitError(null);
    setSuccess(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) closeModal();
  }, [isOpen]);

  const addImageEntry = () => {
    setImageEntries((prev) => [
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

  const removeImageEntry = (id: string) => {
    setImageEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateImageEntry = (id: string, field: Partial<ImageEntry>) => {
    setImageEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...field } : e)),
    );
  };

  const handleFileChange = (id: string, file: File | null) => {
    setImageEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, file, url: file ? "" : e.url } : e,
      ),
    );
  };

  const handleUrlChange = (id: string, url: string) => {
    setImageEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, url, file: url ? null : e.file } : e,
      ),
    );
  };

  const handlePrimaryChange = (id: string) => {
    setImageEntries((prev) =>
      prev.map((e) => ({ ...e, is_primary: e.id === id })),
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitError(null);

    const hasFile = imageEntries.some((e) => e.file);
    const hasUrl = imageEntries.some((e) => e.url.trim() !== "");
    if (!hasFile && !hasUrl) {
      setSubmitError("At least one image (file or URL) is required.");
      return;
    }

    const fileImages: File[] = [];
    const fileMetadata: Omit<ProductImageFile, "file">[] = [];
    const urlImages: {
      image_url: string;
      alt_text?: string;
      display_order: number;
      is_primary: boolean;
    }[] = [];
    let order = 0;
    let primaryAssigned = false;

    imageEntries.forEach((entry) => {
      order++;
      if (entry.file) {
        fileImages.push(entry.file);
        fileMetadata.push({
          alt_text: entry.alt_text || undefined,
          display_order: order,
          is_primary: entry.is_primary,
        });
        primaryAssigned = primaryAssigned || entry.is_primary;
      } else if (entry.url.trim()) {
        urlImages.push({
          image_url: entry.url,
          alt_text: entry.alt_text || undefined,
          display_order: order,
          is_primary: entry.is_primary,
        });
        primaryAssigned = primaryAssigned || entry.is_primary;
      }
    });

    if (!primaryAssigned) {
      setSubmitError("You must select one primary image.");
      return;
    }

    let parsedSpecs = {};
    try {
      parsedSpecs = specsString ? JSON.parse(specsString) : {};
    } catch {}

    // ✅ Convert Naira to cents
    const priceInCents = Math.round(data.price_in_naira * 100);

    const payload = {
      data: {
        name: data.name,
        description: data.description || "",
        price_in_cents: priceInCents,        // 👈 sent in cents
        condition: data.condition,
        stock_status: data.stock_status,
        specs: parsedSpecs,
        category_id: data.category_id,
        images: urlImages,
      },
      imageFiles: fileImages,
      imageMetadata: fileMetadata,
    };

    try {
      const resultAction = await dispatch(createProduct(payload));
      if (createProduct.fulfilled.match(resultAction)) {
        setCreatedProductData(resultAction.payload);
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => closeModal(), 2000);
      } else {
        setSubmitError(
          (resultAction.payload as string) || "Failed to create product",
        );
      }
    } catch (err: any) {
      setSubmitError(err.message || "Unknown error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={success || creating ? undefined : closeModal}
      />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-scale-up"
        style={{ background: bgSurface, border: `1px solid ${border}` }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b flex justify-between items-center"
          style={{ background: bgSurface, borderColor: border }}
        >
          <h2 className="text-xl font-semibold" style={{ color: textPrimary }}>
            Create New Product
          </h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X size={20} style={{ color: textSecondary }} />
          </button>
        </div>

        {/* Success screen */}
        {success ? (
          <div className="p-8 flex flex-col items-center space-y-3 animate-fade-in">
            <CheckCircle size={48} style={{ color: successColor }} />
            <p className="text-lg font-semibold" style={{ color: textPrimary }}>
              Product created successfully!
            </p>
            {createdProductData && (
              <p className="text-sm" style={{ color: textSecondary }}>
                &ldquo;{createdProductData.name}&rdquo;
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: textMuted }}>
              Closing in 2 seconds...
            </p>
          </div>
        ) : creating ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <TechLoader text="Creating product..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-7">
            {/* Basic Information */}
            <section className="space-y-5">
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
                    Product Name *
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20 transition"
                    style={{
                      borderColor: errors.name ? "#EF4444" : border,
                      color: textPrimary,
                    }}
                    placeholder="e.g., iPhone 15 Pro Max"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* ✅ Price in Naira */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("price_in_naira", { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20 transition"
                    style={{
                      borderColor: errors.price_in_naira ? "#EF4444" : border,
                      color: textPrimary,
                    }}
                    placeholder="e.g., 4500"
                  />
                  {errors.price_in_naira && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.price_in_naira.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Condition *
                  </label>
                  <select
                    {...register("condition")}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-primary/20 transition"
                    style={{
                      borderColor: border,
                      color: textPrimary,
                      background: bgSubtle,
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
                    {...register("stock_status")}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-primary/20 transition"
                    style={{
                      borderColor: border,
                      color: textPrimary,
                      background: bgSubtle,
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
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20 transition"
                  style={{ borderColor: border, color: textPrimary }}
                  placeholder="Product description..."
                />
              </div>
            </section>

            {/* Category & Specs */}
            <section className="space-y-5">
              <h3
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: textMuted }}
              >
                Category &amp; Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Category *
                  </label>
                  <select
                    {...register("category_id")}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-primary/20 transition"
                    style={{
                      borderColor: errors.category_id ? "#EF4444" : border,
                      color: textPrimary,
                      background: bgSubtle,
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: textSecondary }}
                  >
                    Specs (JSON)
                  </label>
                  <textarea
                    value={specsString}
                    onChange={(e) => setSpecsString(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border bg-surface text-sm font-mono focus:ring-2 focus:ring-primary/20 transition"
                    style={{ borderColor: border, color: textPrimary }}
                    placeholder='{"brand":"Apple","model":"iPhone 15 Pro","storage":"256GB"}'
                  />
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="space-y-4">
              <h3
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: textMuted }}
              >
                Product Images *
              </h3>
              {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  <X size={16} />
                  {submitError}
                </div>
              )}
              <div className="space-y-4">
                {imageEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-xl border"
                    style={{ borderColor: border }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className="text-sm font-medium"
                        style={{ color: textPrimary }}
                      >
                        Image {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <label
                          className="flex items-center gap-1 text-sm cursor-pointer"
                          style={{ color: textSecondary }}
                        >
                          <input
                            type="radio"
                            name="primary_image"
                            checked={entry.is_primary}
                            onChange={() => handlePrimaryChange(entry.id)}
                            className="mr-1"
                          />
                          Primary
                        </label>
                        {imageEntries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageEntry(entry.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File upload */}
                      <div>
                        <label
                          className="block text-xs mb-2"
                          style={{ color: textSecondary }}
                        >
                          Upload file
                        </label>
                        <label
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer hover:bg-white/5 transition text-sm"
                          style={{ borderColor: border, color: textSecondary }}
                        >
                          <Upload size={16} style={{ color: accent }} />
                          {entry.file ? entry.file.name : "Choose file"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
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

                      {/* Direct URL */}
                      <div>
                        <label
                          className="block text-xs mb-2"
                          style={{ color: textSecondary }}
                        >
                          Or paste a URL
                        </label>
                        <div className="flex items-center gap-2">
                          <LinkIcon size={16} style={{ color: textMuted }} />
                          <input
                            type="url"
                            value={entry.url}
                            onChange={(e) =>
                              handleUrlChange(entry.id, e.target.value)
                            }
                            className="flex-1 px-3 py-2 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20 transition"
                            style={{ borderColor: border, color: textPrimary }}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alt text */}
                    <div className="mt-3">
                      <label
                        className="block text-xs mb-1"
                        style={{ color: textSecondary }}
                      >
                        Alt text
                      </label>
                      <input
                        type="text"
                        value={entry.alt_text}
                        onChange={(e) =>
                          updateImageEntry(entry.id, {
                            alt_text: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border bg-surface text-sm focus:ring-2 focus:ring-primary/20 transition"
                        style={{ borderColor: border, color: textPrimary }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageEntry}
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                style={{ color: accent }}
              >
                <Plus size={16} /> Add another image
              </button>
            </section>

            {/* Actions */}
            <div
              className="flex justify-end gap-4 pt-4 border-t"
              style={{ borderColor: border }}
            >
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-3 rounded-xl border text-sm font-medium hover:bg-white/5 transition"
                style={{ borderColor: border, color: textSecondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-md transition-all disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Product"}
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}