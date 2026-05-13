// services/productApi.ts
import { api } from "../utils/api";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  AddProductImageDto,
  UpdateProductImageDto,
  PaginatedProducts,
  ProductFilters,
  ProductImage,
  ProductImageFile, // ✅ new import
} from "../types/product";

export const productApi = {
  // Public
  getProducts: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.category_id) params.append("category_id", filters.category_id);
    if (filters.condition) params.append("condition", filters.condition);
    if (filters.min_price)
      params.append("min_price", filters.min_price.toString());
    if (filters.max_price)
      params.append("max_price", filters.max_price.toString());
    if (filters.search) params.append("search", filters.search);
    const query = params.toString();
    return api.get<PaginatedProducts>(`/products${query ? `?${query}` : ""}`);
  },
  getProductById: (id: string) => api.get<Product>(`/products/${id}`),

  // Seller specific (authenticated) – get own products
  getMyProducts: () => api.get<PaginatedProducts>("/products/my-products"),

  // ✅ Updated: create product with image files
  createProduct: (payload: {
    data: CreateProductDto;
    imageFiles: File[];
    imageMetadata: Omit<ProductImageFile, "file">[];
  }) => {
    const formData = new FormData();

    // Product data as JSON string (without images)
    formData.append("data", JSON.stringify(payload.data));

    // Append each image file with the field name 'images'
    payload.imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Image metadata as JSON string (must match files order and length)
    formData.append("image_metadata", JSON.stringify(payload.imageMetadata));

    return api.post<Product>("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Axios will set boundary automatically, but we can leave it out
    });
  },

  updateProduct: (id: string, data: UpdateProductDto) =>
    api.patch<Product>(`/products/${id}`, data),
  softDeleteProduct: (id: string) =>
    api.delete<{ message: string }>(`/products/${id}`),

  // Image management (seller)
  addProductImage: (
    productId: string,
    data: AddProductImageDto,
    file?: File,
  ) => {
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    if (data.image_url && data.image_url.trim() !== "") {
      formData.append("image_url", data.image_url);
    }
    if (data.alt_text) formData.append("alt_text", data.alt_text);
    formData.append("display_order", String(data.display_order ?? 0));
    formData.append("is_primary", String(data.is_primary ?? false));

    return api.post<ProductImage>(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateProductImage: (imageId: string, data: UpdateProductImageDto) =>
    api.patch<ProductImage>(`/products/images/${imageId}`, data),
  deleteProductImage: (imageId: string) =>
    api.delete<{ message: string }>(`/products/images/${imageId}`),

  // Admin
  getAllProductsAdmin: (
    page = 1,
    limit = 20,
    includeDeleted = false,
    seller_id?: string,
  ) => {
    let url = `/products/admin/all?page=${page}&limit=${limit}`;
    if (includeDeleted) url += `&includeDeleted=true`;
    if (seller_id) url += `&seller_id=${seller_id}`;
    return api.get<PaginatedProducts>(url);
  },
  restoreProduct: (id: string) => api.post<Product>(`/products/${id}/restore`),
  hardDeleteProduct: (id: string) =>
    api.delete<{ message: string }>(`/products/${id}/permanent`),
};
