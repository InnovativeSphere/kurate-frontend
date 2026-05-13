// services/analyticsApi.ts
import { api } from '../utils/api';
import { SellerDashboard, ProductAnalytics, AdminOverview } from '../types/analytics';

export const analyticsApi = {
  // Seller
  getMyDashboard: () => api.get<SellerDashboard>('/analytics/my-shop'),
  getProductAnalytics: (productId: string) =>
    api.get<ProductAnalytics>(`/analytics/my-shop/products/${productId}`),
  // Admin
  getAdminOverview: () => api.get<AdminOverview>('/analytics/admin/overview'),
};