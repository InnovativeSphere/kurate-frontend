// store/slices/userSlice.ts
import { authApi } from "@/app/services/authApi";
import { userApi } from "@/app/services/userApi";
import {
  LoginCredentials,
  UpdateUserDto,
  User,
  UserStats,
  PaginatedUsers,
  CreateUserDto,
} from "@/app/types/user";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// ─── State interface ─────────────────────────────────────────
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  usersList: User[];
  totalUsers: number;
  userStats: UserStats | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  usersList: [],
  totalUsers: 0,
  userStats: null,
};

// ─── Authentication Thunks ───────────────────────────────────
export const login = createAsyncThunk(
  "user/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  },
);

export const refreshTokens = createAsyncThunk(
  "user/refresh",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.refresh();
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Refresh failed");
    }
  },
);

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response.data.user as User;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const register = createAsyncThunk(
  "user/register",
  async (data: CreateUserDto, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return response.data as User;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data: UpdateUserDto, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data);
      return response.data.user as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.deleteProfile();
      return;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Account deletion failed",
      );
    }
  },
);

// ─── Admin Thunks ────────────────────────────────────────────
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (
    {
      page = 1,
      limit = 20,
      includeDeleted = false,
    }: { page?: number; limit?: number; includeDeleted?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await userApi.getUsers(page, limit, includeDeleted);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

export const fetchUserStats = createAsyncThunk(
  "user/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserStats();
      return response.data as UserStats;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async (
    { userId, role }: { userId: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await userApi.updateUserRole(userId, role);
      return { userId, updatedUser: response.data.user as User };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Role update failed",
      );
    }
  },
);

export const deleteUserById = createAsyncThunk(
  "user/deleteUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "User deletion failed",
      );
    }
  },
);

export const restoreUserById = createAsyncThunk(
  "user/restoreUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      await userApi.restoreUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "User restoration failed",
      );
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
    setShopId: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.shopId = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })

      // LOGOUT
      .addCase(logout.fulfilled, () => initialState)

      // REFRESH
      .addCase(refreshTokens.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })

      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.error = null; // silent failure
        state.isAuthenticated = false;
        state.user = null;
      })

      // UPDATE PROFILE
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        },
      )

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })

      // DELETE PROFILE
      .addCase(deleteProfile.fulfilled, () => initialState)

      // ADMIN: FETCH USERS
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<PaginatedUsers>) => {
          state.usersList = action.payload.data;
          state.totalUsers = action.payload.total;
        },
      )

      // ADMIN: USER STATS
      .addCase(
        fetchUserStats.fulfilled,
        (state, action: PayloadAction<UserStats>) => {
          state.userStats = action.payload;
        },
      )

      // ADMIN: UPDATE USER ROLE
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, updatedUser } = action.payload;
        const index = state.usersList.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.usersList[index] = updatedUser;
        }
        if (state.user?.id === userId) {
          state.user = updatedUser;
        }
      })

      // ADMIN: DELETE USER
      .addCase(
        deleteUserById.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.usersList = state.usersList.filter(
            (u) => u.id !== action.payload,
          );
          state.totalUsers -= 1;
        },
      )

      // ADMIN: RESTORE USER
      .addCase(restoreUserById.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export const { clearError, resetState, setShopId } = userSlice.actions;
export default userSlice.reducer;