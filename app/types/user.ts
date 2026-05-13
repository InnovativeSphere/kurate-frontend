// types/user.ts
export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'SELLER' | 'BUYER';
  theme?: string;
  shopId?: string | null;            // 👈 new – from backend login/profile response
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// ── Rest of the file unchanged ──
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  phone?: string;
  password?: string;
  theme?: string;
}

export interface UserStats {
  total: number;
  newThisWeek: number;
  byRole: Record<string, number>;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  phone?: string;
  role?: 'ADMIN' | 'SELLER' | 'BUYER';
}