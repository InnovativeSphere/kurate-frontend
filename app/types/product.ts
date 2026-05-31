// types/product.ts

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price_in_cents: number;
  condition: 'NEW' | 'USED' | 'REFURBISHED';          // ✅ fixed enum
  stock_status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LIMITED'; // ✅ uses stock_status, not stock_quantity
  specs: Record<string, any>;
  category_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  images: ProductImage[];
  category?: { id: string; name: string; slug: string };
  seller?: { id: string; shop_name: string; whatsapp_number?: string };
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price_in_cents: number;
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  stock_status?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LIMITED';
  specs: Record<string, any>;
  category_id: string;
  images?: Omit<AddProductImageDto, 'product_id'>[];   // ✅ made optional – file upload handles images separately
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price_in_cents?: number;
  condition?: 'NEW' | 'USED' | 'REFURBISHED';
  stock_status?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LIMITED';
  specs?: Record<string, any>;
  category_id?: string;
}

export interface AddProductImageDto {
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary?: boolean;
}

export interface UpdateProductImageDto {
  alt_text?: string;
  display_order?: number;
  is_primary?: boolean;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category_id?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  seller_id?: string;   // ✅ new
}

// ✅ New types for file-based product creation (optional but helpful)
export interface ProductImageFile {
  file: File;                      // the actual file object
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface CreateProductPayload {
  data: CreateProductDto;          // product details (without images)
  images: File[];                  // image files
  image_metadata: Omit<ProductImageFile, 'file'>[]; // metadata array
}