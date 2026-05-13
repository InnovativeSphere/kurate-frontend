// services/authApi.ts
import { LoginCredentials, UpdateUserDto, User, CreateUserDto } from '../types/user';
import { api } from '../utils/api';

export const authApi = {
  register: (data: CreateUserDto) => api.post<User>('/auth/register', data),

  login: (credentials: LoginCredentials) =>
    api.post<{ message?: string; user?: User }>('/auth/login', credentials),

  logout: () => api.post<{ message: string }>('/auth/logout'),

  refresh: () => api.post<{ message: string }>('/auth/refresh'),

  getProfile: () => api.get<{ user: User }>('/users/me'),

  updateProfile: (data: UpdateUserDto) =>
    api.patch<{ user: User }>('/users/me', data),

  deleteProfile: () => api.delete<{ message: string }>('/users/me'),
};