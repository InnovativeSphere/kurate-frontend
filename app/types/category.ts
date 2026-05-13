// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
}

export interface PaginatedCategories {
  data: Category[];
  total: number;
  page: number;
  limit: number;
}