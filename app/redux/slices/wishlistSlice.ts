// store/slices/wishlistSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { wishlistApi } from "../../services/wishlistApi";
import {
  PaginatedWishlist,
  WishlistItem,
  AddWishlistItemDto,
} from "../../types/wishlist";

interface WishlistState {
  items: WishlistItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

// ─── Async Thunks ────────────────────────────────────────────
export const fetchMyWishlist = createAsyncThunk(
  "wishlist/fetchMyWishlist",
  async (
    { page = 1, limit = 20 }: { page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await wishlistApi.getMyWishlist(page, limit);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.addItem({ product_id: productId });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to wishlist",
      );
    }
  },
);

export const removeFromWishlistByProductId = createAsyncThunk(
  "wishlist/removeFromWishlistByProductId",
  async (productId: string, { rejectWithValue }) => {
    try {
      await wishlistApi.removeByProductId(productId);
      return productId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  },
);

export const removeWishlistItemById = createAsyncThunk(
  "wishlist/removeWishlistItemById",
  async (itemId: string, { rejectWithValue }) => {
    try {
      await wishlistApi.removeByItemId(itemId);
      return itemId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove wishlist item",
      );
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    resetWishlist: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchMyWishlist
      .addCase(fetchMyWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyWishlist.fulfilled,
        (state, action: PayloadAction<PaginatedWishlist>) => {
          state.loading = false;
          state.items = action.payload.data;
          state.total = action.payload.total;
        },
      )
      .addCase(fetchMyWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addToWishlist
      .addCase(
        addToWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem>) => {
          state.items = [action.payload, ...state.items];
          state.total += 1;
        },
      )
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // removeFromWishlistByProductId
      .addCase(
        removeFromWishlistByProductId.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (item) => item.product.id !== action.payload,
          );
          state.total -= 1;
        },
      )
      // removeWishlistItemById
      .addCase(
        removeWishlistItemById.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (item) => item.id !== action.payload,
          );
          state.total -= 1;
        },
      );
  },
});

export const { clearWishlistError, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
