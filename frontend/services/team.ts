import api from './api';
import { Team, CreateTeamInput, UpdateTeamInput, ApiResponse } from './types';

// Create new team
export const createTeam = async (teamData: CreateTeamInput): Promise<ApiResponse<Team>> => {
  try {
    const response = await api.post('/teams/create', teamData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating team:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Tạo nhóm thất bại'
    };
  }
};

// Get all teams
export const getAllTeams = async (): Promise<ApiResponse<Team[]>> => {
  try {
    const response = await api.get('/teams');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Lấy danh sách nhóm thất bại'
    };
  }
};

// Get teams by tenant ID
export const getTeamsByTenant = async (tenantId: number): Promise<ApiResponse<Team[]>> => {
  try {
    const response = await api.get(`/teams/tenant/${tenantId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching teams by tenant:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Lấy danh sách nhóm theo công ty thất bại'
    };
  }
};

// Get team name by ID
export const getTeamNameById = async (teamId: string): Promise<string> => {
  try {
    if (!teamId || teamId === 'null' || teamId === 'undefined') {
      return 'Chưa có nhóm';
    }

    const response = await api.get(`/teams/${teamId}/name`);
    return response.data.data?.name || teamId;
  } catch (error) {
    console.error('Error fetching team name:', error);
    return teamId;
  }
};

// Update team
export const updateTeam = async (id: number, teamData: UpdateTeamInput): Promise<ApiResponse<Team>> => {
  try {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating team:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Cập nhật nhóm thất bại'
    };
  }
};

// Delete team
export const deleteTeam = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting team:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Xóa nhóm thất bại'
    };
  }
};

// Delete all teams
export const deleteAllTeams = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete('/teams');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting all teams:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Xóa tất cả nhóm thất bại'
    };
  }
};

// Get team by ID
export const getTeamById = async (id: number): Promise<ApiResponse<Team>> => {
  try {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching team:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Lấy thông tin nhóm thất bại'
    };
  }
};