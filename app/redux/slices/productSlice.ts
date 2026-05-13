// store/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productApi } from '../../services/productApi';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  AddProductImageDto,
  UpdateProductImageDto,
  PaginatedProducts,
  ProductFilters,
  ProductImage,
  ProductImageFile,
} from '../../types/product';

// ─── State ───────────────────────────────────────────────────
interface ProductState {
  // Public list
  products: Product[];
  total: number;
  loading: boolean;
  // Single product
  currentProduct: Product | null;
  currentProductLoading: boolean;
  // Seller's own products
  myProducts: Product[];
  myProductsTotal: number;
  myProductsLoading: boolean;
  // Admin list
  adminProducts: Product[];
  adminTotal: number;
  adminLoading: boolean;
  // Error
  error: string | null;
  // Image management
  imageUploading: boolean;
}

const initialState: ProductState = {
  products: [],
  total: 0,
  loading: false,
  currentProduct: null,
  currentProductLoading: false,
  myProducts: [],
  myProductsTotal: 0,
  myProductsLoading: false,
  adminProducts: [],
  adminTotal: 0,
  adminLoading: false,
  error: null,
  imageUploading: false,
};

// ─── Async Thunks ────────────────────────────────────────────

// Public
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(filters);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

// ✅ Updated: createProduct matches new multipart API
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (payload: {
    data: CreateProductDto;
    imageFiles: File[];
    imageMetadata: Omit<ProductImageFile, 'file'>[];
  }, { rejectWithValue }) => {
    try {
      const response = await productApi.createProduct(payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }: { id: string; data: UpdateProductDto }, { rejectWithValue }) => {
    try {
      const response = await productApi.updateProduct(id, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const softDeleteProduct = createAsyncThunk(
  'product/softDeleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productApi.softDeleteProduct(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  'product/fetchMyProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getMyProducts();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch your products');
    }
  }
);

export const addProductImage = createAsyncThunk(
  'product/addProductImage',
  async (
    { productId, data, file }: { productId: string; data: AddProductImageDto; file?: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await productApi.addProductImage(productId, data, file);
      return { productId, image: response.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Add image failed');
    }
  }
);

export const updateProductImage = createAsyncThunk(
  'product/updateProductImage',
  async ({ imageId, data }: { imageId: string; data: UpdateProductImageDto }, { rejectWithValue }) => {
    try {
      const response = await productApi.updateProductImage(imageId, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update image failed');
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  'product/deleteProductImage',
  async ({ productId, imageId }: { productId: string; imageId: string }, { rejectWithValue }) => {
    try {
      await productApi.deleteProductImage(imageId);
      return { productId, imageId };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Delete image failed');
    }
  }
);

export const fetchAllProductsAdmin = createAsyncThunk(
  'product/fetchAllProductsAdmin',
  async ({ page = 1, limit = 20, includeDeleted = false, seller_id }: 
    { page?: number; limit?: number; includeDeleted?: boolean; seller_id?: string }, 
    { rejectWithValue }) => {
    try {
      const response = await productApi.getAllProductsAdmin(page, limit, includeDeleted, seller_id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin products');
    }
  }
);

export const restoreProductAdmin = createAsyncThunk(
  'product/restoreProductAdmin',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productApi.restoreProduct(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Restore failed');
    }
  }
);

export const hardDeleteProductAdmin = createAsyncThunk(
  'product/hardDeleteProductAdmin',
  async (id: string, { rejectWithValue }) => {
    try {
      await productApi.hardDeleteProduct(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Permanent delete failed');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    resetCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<PaginatedProducts>) => {
        state.loading = false;
        state.products = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.currentProductLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentProductLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductLoading = false;
        state.error = action.payload as string;
        state.currentProduct = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.myProducts = [action.payload, ...state.myProducts];
        state.myProductsTotal += 1;
        if (!action.payload.deleted_at) {
          state.products = [action.payload, ...state.products];
          state.total += 1;
        }
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const updated = action.payload;
        const updateInList = (list: Product[]) => {
          const idx = list.findIndex(p => p.id === updated.id);
          if (idx !== -1) list[idx] = updated;
        };
        updateInList(state.myProducts);
        updateInList(state.products);
        updateInList(state.adminProducts);
        if (state.currentProduct?.id === updated.id) state.currentProduct = updated;
      })
      .addCase(softDeleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.myProducts = state.myProducts.filter(p => p.id !== id);
        state.myProductsTotal -= 1;
        state.products = state.products.filter(p => p.id !== id);
        state.total -= 1;
        state.adminProducts = state.adminProducts.filter(p => p.id !== id);
        state.adminTotal -= 1;
        if (state.currentProduct?.id === id) state.currentProduct = null;
      })
      .addCase(fetchMyProducts.pending, (state) => {
        state.myProductsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action: PayloadAction<PaginatedProducts>) => {
        state.myProductsLoading = false;
        state.myProducts = action.payload.data;
        state.myProductsTotal = action.payload.total;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.myProductsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addProductImage.pending, (state) => {
        state.imageUploading = true;
      })
      .addCase(addProductImage.fulfilled, (state, action) => {
        state.imageUploading = false;
        const { productId, image } = action.payload;
        const addImageToProduct = (product: Product | undefined) => {
          if (product && product.id === productId) {
            product.images.push(image);
            if (image.is_primary) {
              product.images = product.images.map(img => ({ ...img, is_primary: img.id === image.id }));
            }
          }
        };
        const myProduct = state.myProducts.find(p => p.id === productId);
        addImageToProduct(myProduct);
        const pubProduct = state.products.find(p => p.id === productId);
        addImageToProduct(pubProduct);
        const adminProduct = state.adminProducts.find(p => p.id === productId);
        addImageToProduct(adminProduct);
        if (state.currentProduct && state.currentProduct.id === productId) {
          addImageToProduct(state.currentProduct);
        }
      })
      .addCase(addProductImage.rejected, (state, action) => {
        state.imageUploading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductImage.fulfilled, (state, action: PayloadAction<ProductImage>) => {
        const updatedImage = action.payload;
        const productId = updatedImage.product_id;
        const updateImagesInProduct = (product: Product | undefined) => {
          if (product && product.id === productId) {
            const idx = product.images.findIndex(img => img.id === updatedImage.id);
            if (idx !== -1) {
              product.images[idx] = updatedImage;
              if (updatedImage.is_primary) {
                product.images.forEach(img => { img.is_primary = img.id === updatedImage.id; });
              }
            }
          }
        };
        state.myProducts.forEach(p => updateImagesInProduct(p));
        state.products.forEach(p => updateImagesInProduct(p));
        state.adminProducts.forEach(p => updateImagesInProduct(p));
        if (state.currentProduct) updateImagesInProduct(state.currentProduct);
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        const { productId, imageId } = action.payload;
        const removeImageFromProduct = (product: Product | undefined) => {
          if (product && product.id === productId) {
            product.images = product.images.filter(img => img.id !== imageId);
          }
        };
        state.myProducts.forEach(p => removeImageFromProduct(p));
        state.products.forEach(p => removeImageFromProduct(p));
        state.adminProducts.forEach(p => removeImageFromProduct(p));
        if (state.currentProduct) removeImageFromProduct(state.currentProduct);
      })
      .addCase(fetchAllProductsAdmin.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(fetchAllProductsAdmin.fulfilled, (state, action: PayloadAction<PaginatedProducts>) => {
        state.adminLoading = false;
        state.adminProducts = action.payload.data;
        state.adminTotal = action.payload.total;
      })
      .addCase(fetchAllProductsAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreProductAdmin.fulfilled, (state, action: PayloadAction<Product>) => {
        const restored = action.payload;
        if (!restored.deleted_at) {
          state.products = [restored, ...state.products];
          state.total += 1;
        }
        const idx = state.adminProducts.findIndex(p => p.id === restored.id);
        if (idx !== -1) state.adminProducts[idx] = restored;
        else state.adminProducts = [restored, ...state.adminProducts];
        if (state.currentProduct?.id === restored.id) state.currentProduct = restored;
      })
      .addCase(hardDeleteProductAdmin.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.products = state.products.filter(p => p.id !== id);
        state.total = Math.max(0, state.total - 1);
        state.adminProducts = state.adminProducts.filter(p => p.id !== id);
        state.adminTotal = Math.max(0, state.adminTotal - 1);
        state.myProducts = state.myProducts.filter(p => p.id !== id);
        state.myProductsTotal = Math.max(0, state.myProductsTotal - 1);
        if (state.currentProduct?.id === id) state.currentProduct = null;
      });
  },
});

export const { clearProductError, resetCurrentProduct } = productSlice.actions;
export default productSlice.reducer;