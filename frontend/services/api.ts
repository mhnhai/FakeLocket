import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// // Use IP address for React Native compatibility
const API_BASE_URL = 'http://192.168.1.222:3000/api';
// const API_BASE_URL = 'http://localhost:3000/api';
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    console.log('🔗 Making request to:', config.baseURL + config.url);
    console.log('🔗 Request data:', config.data);
    
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔗 Added auth token to request');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    console.error('🔗 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.log('❌ Response error:', error.message);
    console.log('❌ Error status:', error.response?.status);
    console.log('❌ Error data:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔓 Token expired or invalid, removing from storage');
      // Token expired or invalid, remove it
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);

export default api;
