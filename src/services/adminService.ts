import api from '../api/api';
import type { AdminUserDTO, UpdateUserRoleRequest, UserStats } from '../types/admin';

const ADMIN_BASE_URL = '/admin/users';

export const adminService = {
  getAllUsers: async (): Promise<AdminUserDTO[]> => {
    const response = await api.get<AdminUserDTO[]>(ADMIN_BASE_URL);
    return response.data;
  },

  getUserById: async (userId: string): Promise<AdminUserDTO> => {
    const response = await api.get<AdminUserDTO>(`${ADMIN_BASE_URL}/${userId}`);
    return response.data;
  },

  searchUsers: async (keyword: string): Promise<AdminUserDTO[]> => {
    const response = await api.get<AdminUserDTO[]>(`${ADMIN_BASE_URL}/search`, {
      params: { keyword },
    });
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'USER' | 'ADMIN'): Promise<AdminUserDTO> => {
    const request: UpdateUserRoleRequest = { role };
    const response = await api.patch<AdminUserDTO>(
      `${ADMIN_BASE_URL}/${userId}/role`,
      request
    );
    return response.data;
  },

  toggleUserActive: async (userId: string): Promise<AdminUserDTO> => {
    const response = await api.patch<AdminUserDTO>(
      `${ADMIN_BASE_URL}/${userId}/toggle-active`
    );
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`${ADMIN_BASE_URL}/${userId}`);
  },

  getUsersStats: async (): Promise<UserStats> => {
    const response = await api.get<UserStats>(`${ADMIN_BASE_URL}/stats`);
    return response.data;
  },

  promoteToAdmin: async (userId: string): Promise<AdminUserDTO> => {
    const response = await api.post<AdminUserDTO>(
      `${ADMIN_BASE_URL}/${userId}/promote-to-admin`
    );
    return response.data;
  },

  demoteToUser: async (userId: string): Promise<AdminUserDTO> => {
    const response = await api.post<AdminUserDTO>(
      `${ADMIN_BASE_URL}/${userId}/demote-to-user`
    );
    return response.data;
  },
};