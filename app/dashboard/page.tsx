// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Store,
  TrendingUp,
  Sparkles,
  Package,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Users,
  Grid,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Trash2,
  MessageCircle,
  Plus,
  ShoppingBag,
  RotateCcw,
  Heart,
  Building2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import {
  fetchAdminOverview,
  fetchSellerDashboard,
} from "../redux/slices/analyticsSlice";
import { fetchMyShop } from "../redux/slices/sellerSlice";
import {
  fetchMyProducts,
  updateProduct,
  softDeleteProduct,
  fetchAllProductsAdmin,
  restoreProductAdmin,
  hardDeleteProductAdmin,
} from "../redux/slices/productSlice";
import { fetchUsers } from "../redux/slices/userSlice";
import { fetchAllSellersAdmin } from "../redux/slices/sellerSlice";
import {
  fetchMyWishlist,
  removeFromWishlistByProductId,
} from "../redux/slices/wishlistSlice";
import { ViewsChart } from "../components/ViewsChart";
import { TopProductsChart } from "../components/TopProductsChart";
import { AnimatedCard } from "../components/AnimatedCard";
import { TechLoader } from "../components/TechLoader";
import { useThemeColors } from "../hooks/useThemeColors";
import { useInView } from "../hooks/useInView";
import { UpdateProductDto } from "../types/product";
import { User } from "../types/user";
import { SellerProductsGrid } from "./SellerProductsGrid";
import { EditProductModal } from "./EditProductModal";
import { ProductDetailModal } from "./ProductDetailModal";
import { UserManagementModal } from "../components/UserManagementModal";
import { CreateProductModal } from "../components/CreateProductModal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { ProductContactModal } from "../components/ProductContactModal";
import { EditShopModal } from "../components/EditShopModal";

type TabType = "overview" | "shop" | "users" | "allProducts" | "wishlist";

function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  if (!src || hasError) {
    return (
      <div
        className={
          className +
          " flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10"
        }
      >
        <ShoppingBag size={48} className="opacity-30" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

// ✅ Fixed WishlistItemCard – uses actual API fields
function WishlistItemCard({
  item,
  onRemove,
}: {
  item: any;
  onRemove: (productId: string) => void;
}) {
  const router = useRouter();
  const { textPrimary, textSecondary, accent } = useThemeColors();
  const product = item.product;
  const price = (product.price_in_cents / 100).toLocaleString();

  // Real image from product.images array
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].image_url
      : null;

  // Real seller name
  const sellerName = product.seller?.shop_name || "Unknown Seller";

  const handleViewProduct = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <AnimatedCard accentColor={accent}>
      <div className="p-5 space-y-4">
        <ProductImage
          src={imageUrl}
          alt={product.name}
          className="w-full h-40 rounded-xl object-cover"
        />
        <div className="flex justify-between items-start">
          <h3
            className="font-semibold text-lg line-clamp-1"
            style={{ color: textPrimary }}
          >
            {product.name}
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${accent}15`, color: accent }}
          >
            {product.condition}
          </span>
        </div>
        <p className="text-2xl font-bold" style={{ color: textPrimary }}>
          ₦{price}
        </p>
        <p className="text-sm" style={{ color: textSecondary }}>
          Seller: {sellerName}
        </p>
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleViewProduct}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ background: `${accent}15`, color: accent }}
          >
            <MessageCircle size={14} /> View
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 bg-red-500/15 text-red-500 hover:bg-red-500/25"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </AnimatedCard>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    loading: userLoading,
    usersList,
  } = useAppSelector((s: RootState) => s.user);
  const { myShop, myShopLoading, adminSellers } = useAppSelector(
    (s: RootState) => s.seller,
  );
  const {
    adminOverview,
    adminOverviewLoading,
    sellerDashboard,
    sellerDashboardLoading,
  } = useAppSelector((s: RootState) => s.analytics);
  const { myProducts, myProductsLoading, adminProducts, adminLoading } =
    useAppSelector((s: RootState) => s.product);
  const { items: wishlistItems, loading: wishlistLoading } = useAppSelector(
    (s: RootState) => s.wishlist,
  );
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle } =
    useThemeColors();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);
  const [viewingProductName, setViewingProductName] = useState("");
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [refreshingUsers, setRefreshingUsers] = useState(false);
  const [editShopModalOpen, setEditShopModalOpen] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [hardDeleteConfirmOpen, setHardDeleteConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [showUserFilters, setShowUserFilters] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productConditionFilter, setProductConditionFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userActionError, setUserActionError] = useState<string | null>(null);

  const { ref: headerRef, inView: headerInView } = useInView(0.2);

  const isAdmin = user?.role === "ADMIN";
  const isSeller = user?.role === "SELLER";
  const isBuyer = user?.role === "BUYER";

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, userLoading, router]);

  // ✅ Buyer default tab
  useEffect(() => {
    if (isBuyer && activeTab !== "wishlist") {
      setActiveTab("wishlist");
    }
  }, [isBuyer, activeTab]);

  // Master data fetcher
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (isAdmin) {
      dispatch(fetchAdminOverview());
      return;
    }
    if (isSeller) {
      if (!myShop && !myShopLoading) {
        dispatch(fetchMyShop());
        return;
      }
      if (myShop) {
        dispatch(fetchSellerDashboard());
      }
    }
  }, [
    isAuthenticated,
    user,
    isAdmin,
    isSeller,
    myShop,
    myShopLoading,
    dispatch,
  ]);

  // Redirect seller to /my-shop if no shop
  useEffect(() => {
    if (isSeller && !myShopLoading && !myShop && isAuthenticated)
      router.push("/my-shop");
  }, [isSeller, myShopLoading, myShop, isAuthenticated, router]);

  // Fetch products when shop tab active
  useEffect(() => {
    if (isSeller && myShop?.id && activeTab === "shop")
      dispatch(fetchMyProducts());
  }, [isSeller, myShop, activeTab, dispatch]);

  // Fetch wishlist **for everyone** when the tab is active (admins included)
  useEffect(() => {
    if (isAuthenticated && activeTab === "wishlist")
      dispatch(fetchMyWishlist({ page: 1, limit: 100 }));
  }, [isAuthenticated, activeTab, dispatch]);

  // Admin data
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === "users") {
      dispatch(fetchUsers({ page: 1, limit: 100, includeDeleted: true }));
      dispatch(fetchAllSellersAdmin({ page: 1, limit: 100 }));
    }
    if (activeTab === "allProducts") {
      dispatch(
        fetchAllProductsAdmin({ page: 1, limit: 100, includeDeleted: true }),
      );
    }
  }, [isAdmin, activeTab, dispatch]);

  // Force overview re‑render when tab becomes active
  const [overviewKey, setOverviewKey] = useState(0);
  useEffect(() => {
    if (activeTab === "overview") setOverviewKey((k) => k + 1);
  }, [activeTab]);

  const refreshUsersList = async () => {
    setRefreshingUsers(true);
    await dispatch(fetchUsers({ page: 1, limit: 100, includeDeleted: true }));
    await dispatch(fetchAllSellersAdmin({ page: 1, limit: 100 }));
    setRefreshingUsers(false);
  };

  const handleEditProduct = (id: string) =>
    setEditingProduct(myProducts.find((p) => p.id === id));
  const handleSaveProduct = async (id: string, data: UpdateProductDto) => {
    await dispatch(updateProduct({ id, data }));
    if (myShop?.id) dispatch(fetchMyProducts());
  };
  const handleDeleteProduct = async (id: string) => {
    await dispatch(softDeleteProduct(id));
    if (myShop?.id) dispatch(fetchMyProducts());
  };
  const handleViewProduct = (id: string) => {
    const p = myProducts.find((pp) => pp.id === id);
    setViewingProductId(id);
    setViewingProductName(p?.name || "");
  };
  const handleOpenUserModal = (u: User) => {
    setSelectedUser(u);
    setUserActionError(null);
    setUserModalOpen(true);
  };
  const handleRestoreProduct = (p: any) => {
    setSelectedProduct(p);
    setRestoreConfirmOpen(true);
  };
  const confirmRestoreProduct = async () => {
    if (selectedProduct) {
      await dispatch(restoreProductAdmin(selectedProduct.id)).unwrap();
      await dispatch(
        fetchAllProductsAdmin({ page: 1, limit: 100, includeDeleted: true }),
      );
      setRestoreConfirmOpen(false);
      setSelectedProduct(null);
    }
  };
  const handleHardDeleteProduct = (p: any) => {
    setSelectedProduct(p);
    setHardDeleteConfirmOpen(true);
  };
  const confirmHardDeleteProduct = async () => {
    if (selectedProduct) {
      await dispatch(hardDeleteProductAdmin(selectedProduct.id)).unwrap();
      await dispatch(
        fetchAllProductsAdmin({ page: 1, limit: 100, includeDeleted: true }),
      );
      setHardDeleteConfirmOpen(false);
      setSelectedProduct(null);
    }
  };
  const handleRemoveFromWishlist = async (id: string) => {
    await dispatch(removeFromWishlistByProductId(id)).unwrap();
    dispatch(fetchMyWishlist({ page: 1, limit: 100 }));
  };

  const getSellerRecord = (userId: string) =>
    adminSellers.find((s) => s.user_id === userId);

  const safeUsersList = usersList || [];
  const filteredUsers = safeUsersList.filter((u) => {
    if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
    if (userStatusFilter === "active" && u.deleted_at) return false;
    if (userStatusFilter === "disabled" && !u.deleted_at) return false;
    return true;
  });
  const filteredAdminProducts = adminProducts.filter((p) => {
    if (
      productSearch &&
      !p.name.toLowerCase().includes(productSearch.toLowerCase())
    )
      return false;
    if (
      productConditionFilter !== "all" &&
      p.condition !== productConditionFilter
    )
      return false;
    return true;
  });

  const isLoadingOverview =
    userLoading ||
    (isAdmin && adminOverviewLoading) ||
    (isSeller && (myShopLoading || sellerDashboardLoading)) ||
    (isSeller && !myShop && myShopLoading);

  // Build tabs based on role
  let tabs: { id: TabType; label: string; icon: any }[] = [];
  if (isAdmin) {
    tabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "users", label: "Users", icon: Users },
      { id: "allProducts", label: "All Products", icon: Grid },
      { id: "wishlist", label: "Wishlist", icon: Heart },
    ];
  } else if (isSeller && myShop) {
    tabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "shop", label: "My Shop", icon: Building2 },
      { id: "wishlist", label: "Wishlist", icon: Heart },
    ];
  } else if (isBuyer) {
    tabs = [{ id: "wishlist", label: "Wishlist", icon: Heart }];
  }

  return (
    <main
      className="relative min-h-screen py-16 md:py-24 overflow-hidden"
      style={{ background: bgSubtle }}
    >
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1"
          style={{
            position: "absolute",
            width: "clamp(300px,40vw,500px)",
            height: "clamp(300px,40vw,500px)",
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
            width: "clamp(250px,35vw,450px)",
            height: "clamp(250px,35vw,450px)",
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

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-subtle mb-4">
            <TrendingUp size={32} className="text-primary" />
          </div>
          <h1
            className="font-display font-bold text-3xl sm:text-4xl"
            style={{ color: textPrimary }}
          >
            {isAdmin
              ? "Admin Dashboard"
              : isSeller
                ? "My Dashboard"
                : "My Wishlist"}
          </h1>
          <p className="text-sm mt-2" style={{ color: textSecondary }}>
            {isAdmin
              ? "Manage users, products and platform analytics"
              : isSeller
                ? "Manage your shop and products"
                : "View and manage your saved items"}
          </p>
        </div>

        {/* Tabs – show for any role with at least one tab */}
        {tabs.length >= 1 && (
          <div
            className="flex justify-center gap-2 mb-10 border-b"
            style={{ borderColor: border }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id ? "" : "opacity-60 hover:opacity-100"
                }`}
                style={{ color: activeTab === tab.id ? accent : textSecondary }}
              >
                <div className="flex items-center gap-2">
                  <tab.icon size={16} />
                  {tab.label}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ========== OVERVIEW TAB ========== */}
        {activeTab === "overview" && (
          <div key={overviewKey}>
            {isLoadingOverview ? (
              <TechLoader text="Loading analytics..." />
            ) : (isAdmin && adminOverview) || (isSeller && sellerDashboard) ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {isAdmin && adminOverview ? (
                    <>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <Package size={20} style={{ color: textMuted }} />
                            <ArrowUpRight size={16} style={{ color: accent }} />
                          </div>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: textPrimary }}
                          >
                            {adminOverview.total_products}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Total Products
                          </p>
                        </div>
                      </AnimatedCard>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <Eye size={20} style={{ color: textMuted }} />
                            <ArrowUpRight size={16} style={{ color: accent }} />
                          </div>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: textPrimary }}
                          >
                            {adminOverview.total_views}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Total Views
                          </p>
                        </div>
                      </AnimatedCard>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <Store size={20} style={{ color: textMuted }} />
                            <ArrowUpRight size={16} style={{ color: accent }} />
                          </div>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: textPrimary }}
                          >
                            {adminOverview.total_sellers}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Active Sellers
                          </p>
                        </div>
                      </AnimatedCard>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <Calendar size={20} style={{ color: textMuted }} />
                            <ArrowUpRight size={16} style={{ color: accent }} />
                          </div>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: textPrimary }}
                          >
                            {adminOverview.views_today}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Views Today
                          </p>
                        </div>
                      </AnimatedCard>
                    </>
                  ) : isSeller && sellerDashboard ? (
                    <>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <Package size={20} style={{ color: textMuted }} />
                          <p
                            className="text-3xl font-bold"
                            style={{ color: textPrimary }}
                          >
                            {sellerDashboard.total_products}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Total Products
                          </p>
                        </div>
                      </AnimatedCard>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <Eye size={20} style={{ color: textMuted }} />
                          <p
                            className="text-3xl font-bold"
                            style={{ color: textPrimary }}
                          >
                            {sellerDashboard.total_product_views}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Total Product Views
                          </p>
                        </div>
                      </AnimatedCard>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <Store size={20} style={{ color: textMuted }} />
                          <p
                            className="text-base font-semibold truncate"
                            style={{ color: textPrimary }}
                          >
                            {sellerDashboard.shop_name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Store Name
                          </p>
                        </div>
                      </AnimatedCard>
                      <AnimatedCard>
                        <div className="p-6 space-y-2">
                          <Sparkles size={20} style={{ color: textMuted }} />
                          <p
                            className="text-3xl font-bold"
                            style={{ color: textPrimary }}
                          >
                            {sellerDashboard.products.length}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: textSecondary }}
                          >
                            Listed Items
                          </p>
                        </div>
                      </AnimatedCard>
                    </>
                  ) : null}
                </div>

                {/* Charts & Tables */}
                <div className="space-y-10">
                  {isAdmin && adminOverview && (
                    <>
                      <AnimatedCard>
                        <div className="p-6 space-y-4">
                          <h2
                            className="text-xl font-semibold flex items-center gap-2"
                            style={{ color: textPrimary }}
                          >
                            <Eye size={20} style={{ color: accent }} /> Views
                            Trend (Last 7 Days)
                          </h2>
                          {adminOverview.views_per_day?.length > 0 ? (
                            <ViewsChart
                              data={[...adminOverview.views_per_day].reverse()}
                              title="Daily Views"
                            />
                          ) : (
                            <div
                              className="h-80 flex items-center justify-center rounded-lg border border-dashed"
                              style={{ borderColor: border }}
                            >
                              <p style={{ color: textSecondary }}>
                                No view data available yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </AnimatedCard>
                      <AnimatedCard>
                        <div className="p-6 space-y-4">
                          <h2
                            className="text-xl font-semibold flex items-center gap-2"
                            style={{ color: textPrimary }}
                          >
                            <TrendingUp size={20} style={{ color: accent }} />{" "}
                            Top 5 Most Viewed Products
                          </h2>
                          {adminOverview.top_products?.length > 0 ? (
                            <TopProductsChart
                              products={adminOverview.top_products.map((p) => ({
                                product_name: p.product_name,
                                total_views: p.total_views,
                              }))}
                            />
                          ) : (
                            <div
                              className="h-80 flex items-center justify-center rounded-lg border border-dashed"
                              style={{ borderColor: border }}
                            >
                              <p style={{ color: textSecondary }}>
                                No product view data available yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </AnimatedCard>
                    </>
                  )}
                  {isAdmin && adminProducts.length > 0 && (
                    <AnimatedCard>
                      <div className="p-6 space-y-4">
                        <h2
                          className="text-xl font-semibold flex items-center gap-2"
                          style={{ color: textPrimary }}
                        >
                          <Package size={20} style={{ color: accent }} /> All
                          Products (Latest)
                        </h2>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr
                                style={{ borderBottom: `1px solid ${border}` }}
                              >
                                <th className="text-left py-3">Name</th>
                                <th className="text-left py-3">Price</th>
                                <th className="text-left py-3">Condition</th>
                                <th className="text-left py-3">Seller</th>
                                <th className="text-left py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminProducts.slice(0, 10).map((product) => (
                                <tr
                                  key={product.id}
                                  style={{
                                    borderBottom: `1px solid ${border}`,
                                  }}
                                >
                                  <td className="py-3">{product.name}</td>
                                  <td className="py-3">
                                    ₦
                                    {(
                                      product.price_in_cents / 100
                                    ).toLocaleString()}
                                  </td>
                                  <td className="py-3">{product.condition}</td>
                                  <td className="py-3">
                                    {product.seller?.shop_name || "Unknown"}
                                  </td>
                                  <td className="py-3">
                                    {product.deleted_at ? (
                                      <span className="text-red-500">
                                        Deleted
                                      </span>
                                    ) : (
                                      <span className="text-green-500">
                                        Active
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </AnimatedCard>
                  )}
                  {isSeller &&
                    sellerDashboard &&
                    sellerDashboard.products.length > 0 && (
                      <AnimatedCard>
                        <div className="p-6 space-y-4">
                          <h2
                            className="text-xl font-semibold flex items-center gap-2"
                            style={{ color: textPrimary }}
                          >
                            <Package size={20} style={{ color: accent }} /> Your
                            Products
                          </h2>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr
                                  style={{
                                    borderBottom: `1px solid ${border}`,
                                  }}
                                >
                                  <th className="text-left py-3">Product</th>
                                  <th className="text-left py-3">
                                    Total Views
                                  </th>
                                  <th className="text-left py-3">
                                    Last 7 Days
                                  </th>
                                  <th className="text-left py-3">
                                    Last 30 Days
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {sellerDashboard.products.map((product) => (
                                  <tr
                                    key={product.product_id}
                                    style={{
                                      borderBottom: `1px solid ${border}`,
                                    }}
                                  >
                                    <td className="py-3">
                                      {product.product_name}
                                    </td>
                                    <td className="py-3">
                                      {product.total_views}
                                    </td>
                                    <td className="py-3">
                                      {product.views_this_week}
                                    </td>
                                    <td className="py-3">
                                      {product.views_this_month}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </AnimatedCard>
                    )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 space-y-4">
                {isBuyer ? (
                  <>
                    <ShoppingBag
                      size={48}
                      className="mx-auto opacity-30"
                      style={{ color: textSecondary }}
                    />
                    <p style={{ color: textSecondary }}>You're all set!</p>
                    <p className="text-sm" style={{ color: textMuted }}>
                      Browse available products or view your wishlist.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                      style={{ background: `${accent}15`, color: accent }}
                    >
                      <ShoppingBag size={16} /> Browse Products
                    </Link>
                  </>
                ) : (
                  <>
                    <Package
                      size={48}
                      className="mx-auto opacity-30"
                      style={{ color: textSecondary }}
                    />
                    <p style={{ color: textSecondary }}>
                      {isAdmin
                        ? "Could not load admin analytics."
                        : "Could not load your dashboard."}
                    </p>
                    <button
                      onClick={() => {
                        if (isAdmin) dispatch(fetchAdminOverview());
                        else if (isSeller && myShop)
                          dispatch(fetchSellerDashboard());
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                      style={{ background: `${accent}15`, color: accent }}
                    >
                      <RefreshCw size={16} /> Retry
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========== SELLER: MY SHOP TAB ========== */}
        {activeTab === "shop" && isSeller && myShop && (
          <div className="space-y-12">
            <AnimatedCard>
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h2
                    className="text-xl font-semibold flex items-center gap-2"
                    style={{ color: textPrimary }}
                  >
                    <Building2 size={20} style={{ color: accent }} /> Shop
                    Information
                  </h2>
                  <button
                    onClick={() => setEditShopModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    Edit Shop
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: textMuted }}
                    >
                      Shop Name
                    </p>
                    <p
                      className="text-base font-medium mt-1"
                      style={{ color: textPrimary }}
                    >
                      {myShop.shop_name}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: textMuted }}
                    >
                      WhatsApp Number
                    </p>
                    <p
                      className="text-base font-medium mt-1"
                      style={{ color: textPrimary }}
                    >
                      {myShop.whatsapp_number || "Not set"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: textMuted }}
                    >
                      Description
                    </p>
                    <p
                      className="text-base mt-1"
                      style={{ color: textSecondary }}
                    >
                      {myShop.shop_description || "No description provided"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: textMuted }}
                    >
                      Location
                    </p>
                    <p
                      className="text-base font-medium mt-1"
                      style={{ color: textPrimary }}
                    >
                      {myShop.location_text || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: textMuted }}
                    >
                      Verification Status
                    </p>
                    <p
                      className="text-base font-medium mt-1 capitalize"
                      style={{
                        color:
                          myShop.verification_status === "VERIFIED"
                            ? "#00B86E"
                            : "#F59E0B",
                      }}
                    >
                      {myShop.verification_status?.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
            <div className="mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-xl font-semibold flex items-center gap-2"
                  style={{ color: textPrimary }}
                >
                  <Package size={20} style={{ color: accent }} /> My Products
                </h2>
                <button
                  onClick={() => setShowCreateProductModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-md transition-all hover:scale-105"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
              <SellerProductsGrid
                products={myProducts}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                loading={myProductsLoading}
              />
            </div>
          </div>
        )}

        {/* ========== ADMIN: USERS ========== */}
        {activeTab === "users" && isAdmin && (
          <div className="space-y-8">
            <AnimatedCard>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowUserFilters(!showUserFilters)}
                    className="flex items-center gap-2 text-sm font-medium transition-all hover:text-primary"
                    style={{ color: textSecondary }}
                  >
                    <Filter size={14} /> Filter Users{" "}
                    <ChevronDown
                      size={14}
                      className={`transform transition-transform ${showUserFilters ? "rotate-180" : ""}`}
                    />
                  </button>
                  <button
                    onClick={refreshUsersList}
                    disabled={refreshingUsers}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
                    style={{ color: accent }}
                  >
                    <RefreshCw
                      size={14}
                      className={refreshingUsers ? "animate-spin" : ""}
                    />{" "}
                    Refresh
                  </button>
                </div>
                {showUserFilters && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div>
                      <label
                        className="block text-xs uppercase mb-1"
                        style={{ color: textMuted }}
                      >
                        Role
                      </label>
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-sm border bg-surface"
                        style={{ borderColor: border, color: textPrimary }}
                      >
                        <option value="all">All</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SELLER">Seller</option>
                        <option value="BUYER">Buyer</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-xs uppercase mb-1"
                        style={{ color: textMuted }}
                      >
                        Status
                      </label>
                      <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-sm border bg-surface"
                        style={{ borderColor: border, color: textPrimary }}
                      >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedCard>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {filteredUsers.map((u) => {
                const sellerRecord = getSellerRecord(u.id);
                const whatsapp =
                  sellerRecord?.whatsapp_number || "Not provided";
                return (
                  <AnimatedCard key={u.id}>
                    <div className="p-6 space-y-4 text-left h-full flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <h3
                            className="font-semibold text-base truncate"
                            style={{ color: textPrimary }}
                          >
                            {u.email}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleOpenUserModal(u)}
                          className="text-xs px-3 py-1 rounded-full transition-all hover:scale-105 flex-shrink-0"
                          style={{ background: `${accent}15`, color: accent }}
                        >
                          Manage
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ background: `${accent}15`, color: accent }}
                        >
                          {u.role}
                        </span>
                        {u.deleted_at ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-500">
                            Disabled
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-500">
                            Active
                          </span>
                        )}
                      </div>
                      <div
                        className="text-xs flex items-center gap-2"
                        style={{ color: textMuted }}
                      >
                        <MessageCircle size={12} />
                        <span>{whatsapp}</span>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== ADMIN: ALL PRODUCTS ========== */}
        {activeTab === "allProducts" && isAdmin && (
          <div className="space-y-8">
            <AnimatedCard>
              <div className="p-5 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label
                    className="block text-xs uppercase mb-1"
                    style={{ color: textMuted }}
                  >
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: textMuted }}
                    />
                    <input
                      type="text"
                      placeholder="Product name..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border bg-surface text-sm"
                      style={{ borderColor: border, color: textPrimary }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-xs uppercase mb-1"
                    style={{ color: textMuted }}
                  >
                    Condition
                  </label>
                  <select
                    value={productConditionFilter}
                    onChange={(e) => setProductConditionFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg text-sm border bg-surface"
                    style={{ borderColor: border, color: textPrimary }}
                  >
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
              </div>
            </AnimatedCard>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {filteredAdminProducts.map((product) => {
                const firstImage = product.images?.[0]?.image_url;
                const isDeleted = !!product.deleted_at;
                return (
                  <AnimatedCard key={product.id}>
                    <div className="p-5 space-y-4 text-left h-full flex flex-col">
                      <ProductImage
                        src={firstImage}
                        alt={product.name}
                        className="w-full h-40 rounded-xl object-cover"
                      />
                      <div className="flex justify-between items-start">
                        <h3
                          className="font-semibold line-clamp-1 text-lg flex-1"
                          style={{ color: textPrimary }}
                        >
                          {product.name}
                        </h3>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                          style={{ background: `${accent}15`, color: accent }}
                        >
                          {product.condition}
                        </span>
                      </div>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: textPrimary }}
                      >
                        ₦{(product.price_in_cents / 100).toLocaleString()}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span style={{ color: textSecondary }}>
                          Seller: {product.seller?.shop_name || "Unknown"}
                        </span>
                        {isDeleted ? (
                          <span className="text-red-500">Deleted</span>
                        ) : (
                          <span className="text-green-500">Active</span>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        {isDeleted && (
                          <button
                            onClick={() => handleRestoreProduct(product)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                            style={{ background: `${accent}15`, color: accent }}
                          >
                            <RotateCcw size={12} /> Restore
                          </button>
                        )}
                        <button
                          onClick={() => handleHardDeleteProduct(product)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105 bg-red-500/15 text-red-500 hover:bg-red-500/25"
                        >
                          <Trash2 size={12} /> Permanently Delete
                        </button>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== WISHLIST TAB (ALL ROLES) ========== */}
        {activeTab === "wishlist" && (
          <div className="transition-all duration-700">
            {wishlistLoading ? (
              <TechLoader text="Loading your wishlist…" />
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart
                  size={48}
                  className="mx-auto opacity-30"
                  style={{ color: textSecondary }}
                />
                <p className="mt-4" style={{ color: textSecondary }}>
                  Your wishlist is empty.
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-md transition-all"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <WishlistItemCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Moving gradient line */}
        <div className="relative w-full h-px overflow-hidden mt-16">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      {/* Modals */}
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => {
          if (myShop?.id) dispatch(fetchMyProducts());
          setEditingProduct(null);
        }}
      />
      <ProductDetailModal
        isOpen={!!viewingProductId}
        productId={viewingProductId}
        productName={viewingProductName}
        onClose={() => setViewingProductId(null)}
      />
      {showCreateProductModal && (
        <CreateProductModal
          isOpen={showCreateProductModal}
          onClose={() => setShowCreateProductModal(false)}
          onSuccess={() => {
            if (myShop?.id) dispatch(fetchMyProducts());
          }}
        />
      )}
      {userModalOpen && selectedUser && (
        <UserManagementModal
          user={selectedUser}
          seller={adminSellers.find((s) => s.user_id === selectedUser.id)}
          onClose={() => setUserModalOpen(false)}
          onUpdate={() => {
            dispatch(fetchUsers({ page: 1, limit: 100, includeDeleted: true }));
            dispatch(fetchAllSellersAdmin({ page: 1, limit: 100 }));
          }}
        />
      )}
      <ConfirmationModal
        isOpen={restoreConfirmOpen}
        onClose={() => setRestoreConfirmOpen(false)}
        onConfirm={confirmRestoreProduct}
        title="Restore Product"
        message={`Are you sure you want to restore "${selectedProduct?.name}"?`}
        confirmText="Restore"
        isDanger={false}
      />
      <ConfirmationModal
        isOpen={hardDeleteConfirmOpen}
        onClose={() => setHardDeleteConfirmOpen(false)}
        onConfirm={confirmHardDeleteProduct}
        title="Permanently Delete Product"
        message={`Are you sure you want to permanently delete "${selectedProduct?.name}"?`}
        confirmText="Delete Forever"
        isDanger
      />

      {/* Edit Shop Modal */}
      {myShop && (
        <EditShopModal
          isOpen={editShopModalOpen}
          shop={myShop}
          onClose={() => setEditShopModalOpen(false)}
          onSuccess={() => {
            dispatch(fetchMyShop());
            if (myShop?.id) dispatch(fetchMyProducts());
          }}
        />
      )}

      <style jsx>{`
        .moving-gradient-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #4f9eff,
            #7b5fff,
            #c4b5fd,
            #7b5fff,
            #4f9eff,
            transparent
          );
          background-size: 200% 100%;
          animation: flowGradient 3s linear infinite;
          opacity: 0.6;
        }
        @keyframes flowGradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        @keyframes floatOrb1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.98);
          }
        }
        @keyframes floatOrb2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, 25px) scale(1.04);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line {
            animation: none;
          }
          .orb-1,
          .orb-2 {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}