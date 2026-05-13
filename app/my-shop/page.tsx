// app/my-shop/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createMyShop, fetchMyShop } from "../redux/slices/sellerSlice";
import { setShopId } from "../redux/slices/userSlice";
import { useThemeColors } from "../hooks/useThemeColors";
import {
  Building2,
  MapPin,
  Phone,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  LinkIcon,
} from "lucide-react";
import { AnimatedCard } from "../components/AnimatedCard";

export default function CreateShopPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const { myShop, mutationLoading } = useAppSelector((state) => state.seller);
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } =
    useThemeColors();

  const [formData, setFormData] = useState({
    shop_name: "",
    shop_description: "",
    location_text: "",
    whatsapp_number: user?.phone || "",
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "SELLER") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (myShop) {
      router.push("/dashboard");
    }
  }, [myShop, router]);

  useEffect(() => {
    if (user?.phone && !formData.whatsapp_number) {
      setFormData((prev) => ({ ...prev, whatsapp_number: user.phone || "" }));
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.shop_name.trim())
      newErrors.shop_name = "Shop name is required";
    if (!formData.whatsapp_number.trim())
      newErrors.whatsapp_number = "WhatsApp number is required";
    if (
      formData.whatsapp_number &&
      !/^\+?[0-9]{10,15}$/.test(formData.whatsapp_number)
    )
      newErrors.whatsapp_number = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCertificateFile(file);
    if (file) setCertificateUrl(""); // clear URL when file selected
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCertificateUrl(url);
    if (url) setCertificateFile(null); // clear file when URL entered
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    try {
      const result = await dispatch(
        createMyShop({
          data: {
            shop_name: formData.shop_name,
            shop_description: formData.shop_description || undefined,
            location_text: formData.location_text || undefined,
            whatsapp_number: formData.whatsapp_number,
            // If the user provided a direct URL, send it; otherwise undefined
            business_certificate_url: certificateUrl || undefined,
          },
          certificateFile: certificateFile || undefined,
        }),
      ).unwrap();

      dispatch(setShopId(result.id));
      router.push("/dashboard");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create shop");
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center py-16 overflow-hidden"
      style={{ background: bgSubtle }}
    >
      {/* ... floating orbs unchanged ... */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1"
          style={{
            position: "absolute",
            width: "clamp(300px, 40vw, 500px)",
            height: "clamp(300px, 40vw, 500px)",
            borderRadius: "50%",
            background: accent,
            opacity: 0.08,
            filter: "blur(80px)",
            top: "-15%",
            left: "-10%",
            animation: "floatOrb1 25s ease-in-out infinite",
          }}
        />
        <div
          className="orb-2"
          style={{
            position: "absolute",
            width: "clamp(250px, 35vw, 450px)",
            height: "clamp(250px, 35vw, 450px)",
            borderRadius: "50%",
            background: accent,
            opacity: 0.06,
            filter: "blur(70px)",
            bottom: "-10%",
            right: "-5%",
            animation: "floatOrb2 30s ease-in-out infinite",
            animationDelay: "-5s",
          }}
        />
      </div>

      <div className="container max-w-md relative z-10 px-4 sm:px-6">
        <div className="text-center mb-8 transition-all duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-subtle mb-4">
            <Building2 size={32} className="text-primary" />
          </div>
          <h1
            className="font-display font-bold text-3xl sm:text-4xl"
            style={{ color: textPrimary }}
          >
            Create Your Shop
          </h1>
          <p className="text-sm mt-2" style={{ color: textSecondary }}>
            Set up your seller profile to start listing products
          </p>
        </div>

        <AnimatedCard accentColor={accent}>
          <div className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Shop name, description, location, WhatsApp fields unchanged */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: textPrimary }}
                >
                  Shop Name *
                </label>
                <input
                  type="text"
                  value={formData.shop_name}
                  onChange={(e) =>
                    setFormData({ ...formData, shop_name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20"
                  style={{
                    borderColor: errors.shop_name ? "#EF4444" : border,
                    color: textPrimary,
                  }}
                  placeholder="e.g., TechGizmo Store"
                />
                {errors.shop_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.shop_name}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: textPrimary }}
                >
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.shop_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20"
                  style={{ borderColor: border, color: textPrimary }}
                  placeholder="Tell buyers about your shop..."
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: textPrimary }}
                >
                  Location (optional)
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    style={{ color: textMuted }}
                  />
                  <input
                    type="text"
                    value={formData.location_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location_text: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: border, color: textPrimary }}
                    placeholder="Ikeja, Lagos"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: textPrimary }}
                >
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    style={{ color: textMuted }}
                  />
                  <input
                    type="tel"
                    value={formData.whatsapp_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsapp_number: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 rounded-xl border bg-surface focus:ring-2 focus:ring-primary/20"
                    style={{
                      borderColor: errors.whatsapp_number ? "#EF4444" : border,
                      color: textPrimary,
                    }}
                    placeholder="+2348012345678"
                  />
                </div>
                {errors.whatsapp_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.whatsapp_number}
                  </p>
                )}
              </div>

              {/* ─── BUSINESS CERTIFICATE (file or URL) ─── */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textPrimary }}
                >
                  Business Certificate (optional)
                </label>
                <div className="space-y-3">
                  {/* File upload */}
                  <div className="flex items-center gap-3">
                    <label
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all hover:bg-white/5"
                      style={{ borderColor: border }}
                    >
                      <Upload size={16} style={{ color: accent }} />
                      <span
                        className="text-sm"
                        style={{ color: textSecondary }}
                      >
                        {certificateFile ? certificateFile.name : "Upload File"}
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
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Or URL input */}
                  <div className="flex items-center gap-3">
                    <LinkIcon size={16} style={{ color: textMuted }} />
                    <input
                      type="url"
                      value={certificateUrl}
                      onChange={handleUrlChange}
                      placeholder="Or paste a direct URL (e.g., https://...)"
                      className="flex-1 px-3 py-2 rounded-xl border bg-surface text-sm focus:ring-2 focus:ring-primary/20"
                      style={{ borderColor: border, color: textPrimary }}
                    />
                    {certificateUrl && (
                      <button
                        type="button"
                        onClick={() => setCertificateUrl("")}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  <AlertCircle size={16} />
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                disabled={mutationLoading}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-md transition-all disabled:opacity-50"
              >
                {mutationLoading ? "Creating Shop..." : "Create Shop"}
              </button>
            </form>
          </div>
        </AnimatedCard>
      </div>
      <style jsx>{`
        // ... (keep the same animations) ...
      `}</style>
    </main>
  );
}
