import { create } from 'zustand';
import { authService, User } from '../services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Starting login process...', { email });
      set({ isLoading: true, error: null });
      
      const response = await authService.login({ email, password });
      console.log('📡 Login response:', response);
      
      if (response.success) {
        console.log('✅ Login successful, setting auth state');
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('❌ Login failed:', response.message);
        set({
          error: response.message || 'Đăng nhập thất bại',
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.log('🚨 Login error caught:', error);
      console.log('🚨 Error response:', error.response?.data);
      set({
        error: error.response?.data?.message || 'Lỗi đăng nhập',
        isLoading: false,
      });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.register(data);
      
      if (response.success) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          error: response.message || 'Đăng ký thất bại',
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Lỗi đăng ký',
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
