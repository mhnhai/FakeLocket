import api from './api';
import { Tenant, CreateTenantInput, UpdateTenantInput, ApiResponse } from './types';

// Create new tenant
export const createTenant = async (tenantData: CreateTenantInput): Promise<ApiResponse<Tenant>> => {
  try {
    const response = await api.post('/tenants/create', tenantData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Tạo công ty thất bại'
    };
  }
};

// Get all tenants
export const getAllTenants = async (): Promise<ApiResponse<Tenant[]>> => {
  try {
    const response = await api.get('/tenants');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching tenants:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Lấy danh sách công ty thất bại'
    };
  }
};

// Get tenant name by ID
export const getTenantNameById = async (tenantId: string): Promise<string> => {
  try {
    if (!tenantId || tenantId === 'null' || tenantId === 'undefined') {
      return 'Chưa có thông tin';
    }

    const response = await api.get(`/tenants/${tenantId}/name`);
    return response.data.data?.name || tenantId;
  } catch (error) {
    console.error('Error fetching tenant name:', error);
    return tenantId;
  }
};

// Update tenant
export const updateTenant = async (id: number, tenantData: UpdateTenantInput): Promise<ApiResponse<Tenant>> => {
  try {
    const response = await api.put(`/tenants/${id}`, tenantData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating tenant:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Cập nhật công ty thất bại'
    };
  }
};

// Regenerate tenant OTP
export const regenerateTenantOtp = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`/tenants/${id}/regenerate-otp`);
    return response.data;
  } catch (error: any) {
    console.error('Error regenerating OTP:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Tạo OTP mới thất bại'
    };
  }
};

// Verify tenant OTP
export const verifyTenantOtp = async (otpData: { otp: string }): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post('/tenants/verify-otp', otpData);
    return response.data;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Xác thực OTP thất bại'
    };
  }
};

// Delete tenant
export const deleteTenant = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting tenant:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Xóa công ty thất bại'
    };
  }
};

// Delete all tenants
export const deleteAllTenants = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete('/tenants');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting all tenants:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Xóa tất cả công ty thất bại'
    };
  }
};

// Get tenant by ID
export const getTenantById = async (id: number): Promise<ApiResponse<Tenant>> => {
  try {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching tenant:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Lấy thông tin công ty thất bại'
    };
  }
};
