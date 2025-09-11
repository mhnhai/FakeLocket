// User types
export interface User {
  id: number;
  fullname: string;
  email: string;
  password: string;
  tenant_id: number;
  team_id: number;
  role: 'admin' | 'user';
  created_at: Date;
}

export interface CreateUserInput {
  fullname: string;
  email: string;
  password: string;
  tenant_id: number;
  team_id: number;
  role?: 'admin' | 'user';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  fullname: string;
  email: string;
  password: string;
  tenant_id: number;
  team_id: number;
  role: 'admin' | 'user';
}

// Tenant types
export interface Tenant {
  id: number;
  name: string;
  otp?: string;
  otp_expires_at?: Date;
  created_at: Date;
}

export interface CreateTenantInput {
  name: string;
}

export interface UpdateTenantInput {
  name: string;
}

// Team types
export interface Team {
  id: number;
  name: string;
  tenant_id: number;
  created_at: Date;
}

export interface CreateTeamInput {
  name: string;
  tenant_id: number;
}

export interface UpdateTeamInput {
  name: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}
