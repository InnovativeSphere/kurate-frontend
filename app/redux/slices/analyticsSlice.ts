// store/slices/analyticsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { analyticsApi } from '../../services/analyticsApi';
import { SellerDashboard, ProductAnalytics, AdminOverview } from '../../types/analytics';

// ─── State ───────────────────────────────────────────────────
interface AnalyticsState {
  sellerDashboard: SellerDashboard | null;
  sellerDashboardLoading: boolean;
  currentProductAnalytics: ProductAnalytics | null;
  currentProductAnalyticsLoading: boolean;
  adminOverview: AdminOverview | null;
  adminOverviewLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  sellerDashboard: null,
  sellerDashboardLoading: false,
  currentProductAnalytics: null,
  currentProductAnalyticsLoading: false,
  adminOverview: null,
  adminOverviewLoading: false,
  error: null,
};

// ─── Async Thunks ────────────────────────────────────────────

export const fetchSellerDashboard = createAsyncThunk(
  'analytics/fetchSellerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getMyDashboard();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load seller dashboard');
    }
  }
);

export const fetchProductAnalytics = createAsyncThunk(
  'analytics/fetchProductAnalytics',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getProductAnalytics(productId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load product analytics');
    }
  }
);

export const fetchAdminOverview = createAsyncThunk(
  'analytics/fetchAdminOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAdminOverview();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load admin overview');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    resetAnalytics: () => initialState,
  },
  extraReducers: (builder) => {
    // Seller dashboard
    builder
      .addCase(fetchSellerDashboard.pending, (state) => {
        state.sellerDashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerDashboard.fulfilled, (state, action: PayloadAction<SellerDashboard>) => {
        state.sellerDashboardLoading = false;
        state.sellerDashboard = action.payload;
      })
      .addCase(fetchSellerDashboard.rejected, (state, action) => {
        state.sellerDashboardLoading = false;
        state.error = action.payload as string;
      })
      // Product analytics
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.currentProductAnalyticsLoading = true;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, action: PayloadAction<ProductAnalytics>) => {
        state.currentProductAnalyticsLoading = false;
        state.currentProductAnalytics = action.payload;
      })
      .addCase(fetchProductAnalytics.rejected, (state, action) => {
        state.currentProductAnalyticsLoading = false;
        state.error = action.payload as string;
      })
      // Admin overview
      .addCase(fetchAdminOverview.pending, (state) => {
        state.adminOverviewLoading = true;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action: PayloadAction<AdminOverview>) => {
        state.adminOverviewLoading = false;
        state.adminOverview = action.payload;
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.adminOverviewLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnalyticsError, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;