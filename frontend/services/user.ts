import api from './api';
import { User, CreateUserInput, LoginInput, UpdateUserInput, ApiResponse } from './types';

// Register a new user
export const registerUser = async (userData: CreateUserInput): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error: any) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Đăng ký thất bại'
    };
  }
};

// Login user
export const loginUser = async (loginData: LoginInput): Promise<ApiResponse<{ user: User; token: string }>> => {
  try {
    const response = await api.post('/users/login', loginData);
    return response.data;
  } catch (error: any) {
    console.error('Error logging in:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Đăng nhập thất bại'
    };
  }
};

// Get all users
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Lấy danh sách người dùng thất bại'
    };
  }
};

// Update user
export const updateUser = async (id: number, userData: UpdateUserInput): Promise<ApiResponse<User>> => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Cập nhật người dùng thất bại'
    };
  }
};

// Delete user
export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Xóa người dùng thất bại'
    };
  }
};

// Delete all users
export const deleteAllUsers = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete('/users');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting all users:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Xóa tất cả người dùng thất bại'
    };
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Lấy thông tin người dùng thất bại'
    };
  }
};
