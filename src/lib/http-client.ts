import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1100/api/v1';

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response Interceptor
httpClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    
    // Global Error Handling with Sonner
    toast.error(message);

    if (error.response?.status === 401) {
      // Handle Token Refresh or Logout
      console.error('Unauthorized access');
    }

    return Promise.reject(error);
  }
);

export default httpClient;
