// services/wishlistApi.ts
import { api } from '../utils/api';
import { PaginatedWishlist, AddWishlistItemDto, WishlistItem } from '../types/wishlist';

export const wishlistApi = {
  // User endpoints
  getMyWishlist: (page = 1, limit = 20) =>
    api.get<PaginatedWishlist>(`/wishlist?page=${page}&limit=${limit}`),

  addItem: (data: AddWishlistItemDto) =>
    api.post<WishlistItem>('/wishlist', data),

  removeByProductId: (productId: string) =>
    api.delete<{ message: string }>(`/wishlist/product/${productId}`),

  removeByItemId: (itemId: string) =>
    api.delete<{ message: string }>(`/wishlist/items/${itemId}`),

  // Admin endpoints (optional)
  adminGetUserWishlist: (userId: string, page = 1, limit = 20) =>
    api.get<PaginatedWishlist>(`/wishlist/admin/user/${userId}?page=${page}&limit=${limit}`),

  adminRemoveItem: (itemId: string) =>
    api.delete<{ message: string }>(`/wishlist/admin/items/${itemId}`),
};