// types/analytics.ts
export interface ProductAnalytics {
  product_id: string;
  product_name: string;
  product_description: string;
  price_in_cents: number;
  condition: string;
  stock_status: string;
  total_views: number;
  views_this_week: number;
  views_this_month: number;
  last_viewed_at: string | null;
}

export interface SellerDashboard {
  seller_id: string;
  shop_name: string;
  total_products: number;
  total_product_views: number;
  products: ProductAnalytics[];
}

export interface AdminOverview {
  total_products: number;
  total_views: number;
  total_sellers: number;
  views_today: number;
  views_this_week: number;
  views_per_day: Array<{ date: string; count: number }>;
  top_products: Array<{
    product_id: string;
    product_name: string;
    shop_name: string;
    total_views: number;
  }>;
}