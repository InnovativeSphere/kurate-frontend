// store/slices/sellerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { sellerApi } from "../../services/sellerApi";
import {
  Seller,
  CreateSellerDto,
  UpdateSellerDto,
  UpdateVerificationDto,
  PaginatedSellers,
  SellerStats,
} from "../../types/seller";

// ─── State ───────────────────────────────────────────────────
interface SellerState {
  // Own shop
  myShop: Seller | null;
  myShopLoading: boolean;
  mutationLoading: boolean;
  // Public sellers list
  sellers: Seller[];
  sellersTotal: number;
  sellersLoading: boolean;
  // Admin sellers list
  adminSellers: Seller[];
  adminSellersTotal: number;
  adminSellersLoading: boolean;
  // Stats
  stats: SellerStats | null;
  statsLoading: boolean;
  // General error
  error: string | null;
}

const initialState: SellerState = {
  myShop: null,
  myShopLoading: false,
  mutationLoading: false,
  sellers: [],
  sellersTotal: 0,
  sellersLoading: false,
  adminSellers: [],
  adminSellersTotal: 0,
  adminSellersLoading: false,
  stats: null,
  statsLoading: false,
  error: null,
};

// ─── Async Thunks ────────────────────────────────────────────
export const fetchActiveSellers = createAsyncThunk(
  "seller/fetchActiveSellers",
  async (
    { page = 1, limit = 20 }: { page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await sellerApi.getActiveSellers(page, limit);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sellers",
      );
    }
  },
);

export const fetchSellerById = createAsyncThunk(
  "seller/fetchSellerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerById(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Seller not found");
    }
  },
);

// ✅ Updated thunk: accepts data + optional file
export const createMyShop = createAsyncThunk(
  "seller/createMyShop",
  async (
    { data, certificateFile }: { data: CreateSellerDto; certificateFile?: File },
    { rejectWithValue },
  ) => {
    try {
      const response = await sellerApi.createMyShop(data, certificateFile);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create shop",
      );
    }
  },
);

export const fetchMyShop = createAsyncThunk(
  "seller/fetchMyShop",
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getMyShop();
      return response.data;
    } catch (err: any) {
      if (err.status === 404) return null;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch shop",
      );
    }
  },
);

export const updateMyShop = createAsyncThunk(
  'seller/updateMyShop',
  async (
    { data, certificateFile }: { data: UpdateSellerDto; certificateFile?: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await sellerApi.updateMyShop(data, certificateFile);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);
export const disableMyShop = createAsyncThunk(
  "seller/disableMyShop",
  async (_, { rejectWithValue }) => {
    try {
      await sellerApi.disableMyShop();
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Disable failed");
    }
  },
);

// Admin thunks (unchanged)
export const fetchAllSellersAdmin = createAsyncThunk(
  "seller/fetchAllSellersAdmin",
  async (
    { page = 1, limit = 20, status, includeDeleted = false }: any,
    { rejectWithValue },
  ) => {
    try {
      const response = await sellerApi.getAllSellersAdmin(
        page,
        limit,
        status,
        includeDeleted,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch admin sellers",
      );
    }
  },
);

export const fetchSellerStats = createAsyncThunk(
  "seller/fetchSellerStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerStats();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);

export const updateSellerVerification = createAsyncThunk(
  "seller/updateSellerVerification",
  async (
    { sellerId, data }: { sellerId: string; data: UpdateVerificationDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await sellerApi.updateSellerVerification(sellerId, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Verification update failed",
      );
    }
  },
);

export const adminUpdateSeller = createAsyncThunk(
  "seller/adminUpdateSeller",
  async (
    { sellerId, data }: { sellerId: string; data: UpdateSellerDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await sellerApi.adminUpdateSeller(sellerId, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Admin update failed",
      );
    }
  },
);

export const adminSoftDeleteSeller = createAsyncThunk(
  "seller/adminSoftDeleteSeller",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      await sellerApi.adminSoftDeleteSeller(sellerId);
      return sellerId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Soft delete failed",
      );
    }
  },
);

export const adminRestoreSeller = createAsyncThunk(
  "seller/adminRestoreSeller",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      const response = await sellerApi.adminRestoreSeller(sellerId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Restore failed");
    }
  },
);

export const adminHardDeleteSeller = createAsyncThunk(
  "seller/adminHardDeleteSeller",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      await sellerApi.adminHardDeleteSeller(sellerId);
      return sellerId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Permanent delete failed",
      );
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────
const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    clearSellerError: (state) => {
      state.error = null;
    },
    resetMyShop: (state) => {
      state.myShop = null;
    },
    resetSellerState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveSellers.pending, (state) => {
        state.sellersLoading = true;
        state.error = null;
      })
      .addCase(
        fetchActiveSellers.fulfilled,
        (state, action: PayloadAction<PaginatedSellers>) => {
          state.sellersLoading = false;
          state.sellers = action.payload.data;
          state.sellersTotal = action.payload.total;
        },
      )
      .addCase(fetchActiveSellers.rejected, (state, action) => {
        state.sellersLoading = false;
        state.error = action.payload as string;
      })
      // createMyShop
      .addCase(createMyShop.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(
        createMyShop.fulfilled,
        (state, action: PayloadAction<Seller>) => {
          state.mutationLoading = false;
          state.myShop = action.payload;
        },
      )
      .addCase(createMyShop.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload as string;
      })
      // fetchMyShop
      .addCase(fetchMyShop.pending, (state) => {
        state.myShopLoading = true;
      })
      .addCase(
        fetchMyShop.fulfilled,
        (state, action: PayloadAction<Seller | null>) => {
          state.myShopLoading = false;
          state.myShop = action.payload;
        },
      )
      .addCase(fetchMyShop.rejected, (state) => {
        state.myShopLoading = false;
        state.myShop = null;
      })
      // updateMyShop
      .addCase(updateMyShop.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(
        updateMyShop.fulfilled,
        (state, action: PayloadAction<Seller>) => {
          state.mutationLoading = false;
          state.myShop = action.payload;
        },
      )
      .addCase(updateMyShop.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload as string;
      })
      // disableMyShop
      .addCase(disableMyShop.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })
      .addCase(disableMyShop.fulfilled, (state) => {
        state.mutationLoading = false;
        state.myShop = null;
      })
      .addCase(disableMyShop.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload as string;
      })
      // Admin fetch all sellers
      .addCase(fetchAllSellersAdmin.pending, (state) => {
        state.adminSellersLoading = true;
      })
      .addCase(
        fetchAllSellersAdmin.fulfilled,
        (state, action: PayloadAction<PaginatedSellers>) => {
          state.adminSellersLoading = false;
          state.adminSellers = action.payload.data;
          state.adminSellersTotal = action.payload.total;
        },
      )
      .addCase(fetchAllSellersAdmin.rejected, (state, action) => {
        state.adminSellersLoading = false;
        state.error = action.payload as string;
      })
      // fetchSellerStats
      .addCase(fetchSellerStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(
        fetchSellerStats.fulfilled,
        (state, action: PayloadAction<SellerStats>) => {
          state.statsLoading = false;
          state.stats = action.payload;
        },
      )
      .addCase(fetchSellerStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload as string;
      })
      // updateSellerVerification
      .addCase(
        updateSellerVerification.fulfilled,
        (state, action: PayloadAction<Seller>) => {
          const updated = action.payload;
          const index = state.adminSellers.findIndex(
            (s) => s.id === updated.id,
          );
          if (index !== -1) state.adminSellers[index] = updated;
          if (state.myShop?.id === updated.id) state.myShop = updated;
        },
      )
      // adminUpdateSeller
      .addCase(
        adminUpdateSeller.fulfilled,
        (state, action: PayloadAction<Seller>) => {
          const updated = action.payload;
          const idx = state.adminSellers.findIndex((s) => s.id === updated.id);
          if (idx !== -1) state.adminSellers[idx] = updated;
          if (state.myShop?.id === updated.id) state.myShop = updated;
        },
      )
      // adminSoftDeleteSeller
      .addCase(
        adminSoftDeleteSeller.fulfilled,
        (state, action: PayloadAction<string>) => {
          const id = action.payload;
          state.adminSellers = state.adminSellers.filter((s) => s.id !== id);
          state.adminSellersTotal -= 1;
          if (state.myShop?.id === id) state.myShop = null;
        },
      )
      // adminRestoreSeller
      .addCase(
        adminRestoreSeller.fulfilled,
        (state, action: PayloadAction<Seller>) => {
          const restored = action.payload;
          const exists = state.adminSellers.some((s) => s.id === restored.id);
          if (!exists) {
            state.adminSellers = [restored, ...state.adminSellers];
            state.adminSellersTotal += 1;
          } else {
            const idx = state.adminSellers.findIndex(
              (s) => s.id === restored.id,
            );
            if (idx !== -1) state.adminSellers[idx] = restored;
          }
          if (state.myShop?.id === restored.id) state.myShop = restored;
        },
      )
      // adminHardDeleteSeller
      .addCase(
        adminHardDeleteSeller.fulfilled,
        (state, action: PayloadAction<string>) => {
          const id = action.payload;
          state.adminSellers = state.adminSellers.filter((s) => s.id !== id);
          state.adminSellersTotal = Math.max(0, state.adminSellersTotal - 1);
          if (state.myShop?.id === id) state.myShop = null;
        },
      );
  },
});

export const { clearSellerError, resetMyShop, resetSellerState } =
  sellerSlice.actions;
export default sellerSlice.reducer;