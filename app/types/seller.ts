// types/seller.ts
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Seller {
  id: string;
  shop_name: string;
  shop_description?: string | null;
  location_text?: string | null;
  whatsapp_number?: string | null;
  logo?: string | null;
  cover_image?: string | null;
  verification_status: VerificationStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user?: {
    id: string;
    email: string;
    phone?: string | null;
  };
}

export interface CreateSellerDto {
  shop_name: string;
  shop_description?: string;
  location_text?: string;
  whatsapp_number: string;
  business_certificate_url?: string;
}

export interface UpdateSellerDto {
  shop_name?: string;
  shop_description?: string;
  location_text?: string;
  whatsapp_number?: string;
  business_certificate_url?: string;
}

export interface UpdateVerificationDto {
  status: VerificationStatus;
}

export interface PaginatedSellers {
  data: Seller[];
  total: number;
  page: number;
  limit: number;
}

export interface SellerStats {
  total: number;
  newThisWeek: number;
  byStatus: Record<VerificationStatus, number>;
}