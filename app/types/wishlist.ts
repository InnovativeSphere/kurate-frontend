// types/wishlist.ts

export interface WishlistProduct {
  id: string;
  name: string;
  price_in_cents: number;
  condition: string;
  stock_status: string;
  primary_image_url?: string;
  seller_shop_name: string;
}

export interface WishlistItem {
  id: string;
  added_at: string;
  product: WishlistProduct;
}

export interface PaginatedWishlist {
  data: WishlistItem[];
  total: number;
  page: number;
  limit: number;
}

export interface AddWishlistItemDto {
  product_id: string;
}