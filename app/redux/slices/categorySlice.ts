// store/slices/categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { categoryApi } from '../../services/categoryApi';
import { Category, CreateCategoryDto, UpdateCategoryDto, PaginatedCategories } from '../../types/category';

// ─── State ───────────────────────────────────────────────────
interface CategoryState {
  // Public
  categories: Category[];
  total: number;
  loading: boolean;
  error: string | null;
  // Admin
  adminCategories: Category[];
  adminTotal: number;
  adminLoading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  total: 0,
  loading: false,
  error: null,
  adminCategories: [],
  adminTotal: 0,
  adminLoading: false,
};

// ─── Async Thunks ────────────────────────────────────────────
// Public
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategories(page, limit);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategoryById(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Category not found');
    }
  }
);

// Admin
export const fetchAllCategoriesAdmin = createAsyncThunk(
  'category/fetchAllCategoriesAdmin',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getAllCategoriesAdmin(page, limit);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (data: CreateCategoryDto, { rejectWithValue }) => {
    try {
      const response = await categoryApi.createCategory(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }: { id: string; data: UpdateCategoryDto }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.updateCategory(id, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const softDeleteCategory = createAsyncThunk(
  'category/softDeleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryApi.softDeleteCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Soft delete failed');
    }
  }
);

export const restoreCategory = createAsyncThunk(
  'category/restoreCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await categoryApi.restoreCategory(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Restore failed');
    }
  }
);

export const hardDeleteCategory = createAsyncThunk(
  'category/hardDeleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryApi.hardDeleteCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Permanent delete failed');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    resetCategoryState: () => initialState,
  },
  extraReducers: (builder) => {
    // fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<PaginatedCategories>) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCategoryById (optional – store a single category if needed; we'll keep it simple)
      // Admin fetch
      .addCase(fetchAllCategoriesAdmin.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategoriesAdmin.fulfilled, (state, action: PayloadAction<PaginatedCategories>) => {
        state.adminLoading = false;
        state.adminCategories = action.payload.data;
        state.adminTotal = action.payload.total;
      })
      .addCase(fetchAllCategoriesAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload as string;
      })
      // createCategory
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        // Add to admin list if present
        state.adminCategories = [action.payload, ...state.adminCategories];
        state.adminTotal += 1;
        // Also add to public list if it meets criteria (not soft‑deleted)
        if (!action.payload.deleted_at) {
          state.categories = [action.payload, ...state.categories];
          state.total += 1;
        }
      })
      // updateCategory
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const updated = action.payload;
        // Update in admin list
        const adminIndex = state.adminCategories.findIndex((c) => c.id === updated.id);
        if (adminIndex !== -1) state.adminCategories[adminIndex] = updated;
        // Update in public list if not soft‑deleted
        if (!updated.deleted_at) {
          const publicIndex = state.categories.findIndex((c) => c.id === updated.id);
          if (publicIndex !== -1) state.categories[publicIndex] = updated;
        } else {
          // If now soft‑deleted, remove from public list
          state.categories = state.categories.filter((c) => c.id !== updated.id);
          state.total -= 1;
        }
      })
      // softDeleteCategory
      .addCase(softDeleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        // Remove from public list (soft‑deleted not shown publicly)
        state.categories = state.categories.filter((c) => c.id !== id);
        state.total -= 1;
        // Update admin list: mark as deleted (or refetch). For consistency, we'll refetch admin list later.
        // Better: call fetchAllCategoriesAdmin after delete. We'll just remove it from admin list for UI consistency.
        state.adminCategories = state.adminCategories.filter((c) => c.id !== id);
        state.adminTotal -= 1;
      })
      // restoreCategory
      .addCase(restoreCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const restored = action.payload;
        // Add back to public list
        if (!restored.deleted_at) {
          state.categories = [restored, ...state.categories];
          state.total += 1;
        }
        // Update admin list
        const adminIdx = state.adminCategories.findIndex((c) => c.id === restored.id);
        if (adminIdx !== -1) {
          state.adminCategories[adminIdx] = restored;
        } else {
          state.adminCategories = [restored, ...state.adminCategories];
          state.adminTotal += 1;
        }
      })
      // hardDeleteCategory
      .addCase(hardDeleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        // Remove from both lists
        state.categories = state.categories.filter((c) => c.id !== id);
        state.total = Math.max(0, state.total - 1);
        state.adminCategories = state.adminCategories.filter((c) => c.id !== id);
        state.adminTotal = Math.max(0, state.adminTotal - 1);
      });
  },
});

export const { clearCategoryError, resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;