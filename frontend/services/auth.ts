import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: number;
  fullname: string;
  email: string;
  tenant_id: number;
  team_id: number;
  role: 'admin' | 'user';
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  otp: string;
  team_id?: number;
  create_tenant?: boolean;
  tenant_name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Tenant {
  id: number;
  name: string;
  otp: string;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  tenant_id: number;
  created_at: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🌐 Making API call to /users/login with data:', data);
    
    try {
      const response = await api.post('/users/login', data);
      console.log('🌐 API response status:', response.status);
      console.log('🌐 API response data:', response.data);
      
      if (response.data.success && response.data.data.token) {
        console.log('💾 Storing token and user in SecureStore');
        await SecureStore.setItemAsync('authToken', response.data.data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.log('🌐 API call failed:', error.message);
      console.log('🌐 Error response:', error.response?.data);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/users/register', data);
    
    if (response.data.success && response.data.data.token) {
      await SecureStore.setItemAsync('authToken', response.data.data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await SecureStore.getItemAsync('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  async verifyTenantOtp(otp: string): Promise<{ success: boolean; data?: { tenant_id: number; tenant_name: string } }> {
    try {
      const response = await api.post('/tenants/verify-otp', { otp });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi xác thực OTP',
      };
    }
  }

  async getTeamsByTenant(tenantId: number): Promise<{ success: boolean; data?: Team[] }> {
    try {
      const response = await api.get(`/teams/tenant/${tenantId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi lấy danh sách phòng ban',
      };
    }
  }
}

export const authService = new AuthService();
