// services/sellerApi.ts
import { api } from '../utils/api';
import {
  Seller,
  CreateSellerDto,
  UpdateSellerDto,
  UpdateVerificationDto,
  PaginatedSellers,
  SellerStats,
} from '../types/seller';

export const sellerApi = {
  // Public
  getActiveSellers: (page = 1, limit = 20) =>
    api.get<PaginatedSellers>(`/sellers?page=${page}&limit=${limit}`),
  getSellerById: (id: string) => api.get<Seller>(`/sellers/${id}`),

  // Own shop (authenticated)
  createMyShop: (data: CreateSellerDto, certificateFile?: File) => {
    const formData = new FormData();
    formData.append('shop_name', data.shop_name);
    formData.append('whatsapp_number', data.whatsapp_number);
    if (data.shop_description) formData.append('shop_description', data.shop_description);
    if (data.location_text) formData.append('location_text', data.location_text);
    if (certificateFile) {
      formData.append('certificate', certificateFile);
    }
    if (data.business_certificate_url) {
      formData.append('business_certificate_url', data.business_certificate_url);
    }
    return api.post<Seller>('/sellers/my-shop', formData);
  },

  getMyShop: () => api.get<Seller>('/sellers/my-shop'),

  // ✅ Updated: update shop with optional certificate file
  updateMyShop: (data: UpdateSellerDto, certificateFile?: File) => {
    const formData = new FormData();
    if (data.shop_name) formData.append('shop_name', data.shop_name);
    if (data.shop_description) formData.append('shop_description', data.shop_description);
    if (data.location_text) formData.append('location_text', data.location_text);
    if (data.whatsapp_number) formData.append('whatsapp_number', data.whatsapp_number);
    if (certificateFile) formData.append('certificate', certificateFile);
    if (data.business_certificate_url) formData.append('business_certificate_url', data.business_certificate_url);
    return api.patch<Seller>('/sellers/my-shop', formData);
  },

  disableMyShop: () => api.delete<{ message: string }>('/sellers/my-shop'),

  // Admin
  getAllSellersAdmin: (page = 1, limit = 20, status?: string, includeDeleted = false) => {
    let url = `/sellers/admin/all?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (includeDeleted) url += `&includeDeleted=true`;
    return api.get<PaginatedSellers>(url);
  },
  getSellerStats: () => api.get<SellerStats>('/sellers/admin/stats'),
  updateSellerVerification: (sellerId: string, data: UpdateVerificationDto) =>
    api.patch<Seller>(`/sellers/${sellerId}/verification`, data),
  adminUpdateSeller: (sellerId: string, data: UpdateSellerDto) =>
    api.patch<Seller>(`/sellers/${sellerId}`, data),
  adminSoftDeleteSeller: (sellerId: string) =>
    api.delete<{ message: string }>(`/sellers/${sellerId}`),
  adminRestoreSeller: (sellerId: string) =>
    api.post<Seller>(`/sellers/${sellerId}/restore`),
  adminHardDeleteSeller: (sellerId: string) =>
    api.delete<{ message: string }>(`/sellers/${sellerId}/permanent`),
};