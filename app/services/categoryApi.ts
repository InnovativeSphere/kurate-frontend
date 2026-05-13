// services/categoryApi.ts

import { Category, CreateCategoryDto, PaginatedCategories, UpdateCategoryDto } from "../types/category";
import { api } from "../utils/api";

export const categoryApi = {
  // Public
  getCategories: (page = 1, limit = 20) =>
    api.get<PaginatedCategories>(`/categories?page=${page}&limit=${limit}`),

  getCategoryById: (id: string) => api.get<Category>(`/categories/${id}`),

  // Admin
  getAllCategoriesAdmin: (page = 1, limit = 20) =>
    api.get<PaginatedCategories>(`/categories/admin/all?page=${page}&limit=${limit}`),

  createCategory: (data: CreateCategoryDto) =>
    api.post<Category>('/categories', data),

  updateCategory: (id: string, data: UpdateCategoryDto) =>
    api.patch<Category>(`/categories/${id}`, data),

  softDeleteCategory: (id: string) =>
    api.delete<{ message: string }>(`/categories/${id}`),

  restoreCategory: (id: string) =>
    api.post<Category>(`/categories/${id}/restore`),

  hardDeleteCategory: (id: string) =>
    api.delete<{ message: string }>(`/categories/${id}/permanent`),
};