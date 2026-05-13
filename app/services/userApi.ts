// services/userApi.ts
import { CreateUserDto, PaginatedUsers, User, UserStats } from "../types/user";
import { api } from "../utils/api";

export const userApi = {
  getUsers: (page = 1, limit = 20, includeDeleted = false) =>
    api.get<PaginatedUsers>(
      `/users?page=${page}&limit=${limit}&includeDeleted=${includeDeleted}`,
    ),

  register: (data: CreateUserDto) => api.post<User>("/auth/register", data),

  getUserById: (id: string) => api.get<{ user: User }>(`/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    api.patch<{ user: User }>(`/users/${id}/role`, { role }),

  // Soft delete (disable) user
  disableUser: (id: string) =>
    api.patch<{ message: string }>(`/users/${id}/disable`),

  // Hard delete (permanent) user
  deleteUser: (id: string) => api.delete<{ message: string }>(`/users/${id}`),

  restoreUser: (id: string) =>
    api.post<{ message: string }>(`/users/${id}/restore`),

  getUserStats: () => api.get<UserStats>("/users/stats"),
};
