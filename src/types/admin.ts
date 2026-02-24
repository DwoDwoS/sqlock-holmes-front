export interface AdminUserDTO {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  totalSubmissions?: number;
  solvedInvestigations?: number;
  averageScore?: number;
}

export interface UpdateUserRoleRequest {
  role: 'USER' | 'ADMIN';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  admins: number;
  regularUsers: number;
}