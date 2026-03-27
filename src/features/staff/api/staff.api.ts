import httpClient from '../../../lib/http-client';
import {
  Staff,
  StaffCreateRequest,
  StaffUpdateRequest,
  StaffsResponse
} from '../types/staff.types';

export const staffApi = {
  getAll: async (): Promise<StaffsResponse> => {
    const response = await httpClient.get('/staff');
    return response.data;
  },

  getById: async (id: number): Promise<{ success: boolean; data: Staff }> => {
    const response = await httpClient.get(`/staff/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<{ success: boolean; data: Staff }> => {
    const response = await httpClient.get(`/staff/by-user/${userId}`);
    return response.data;
  },

  create: async (data: StaffCreateRequest): Promise<{ success: boolean; data: Staff }> => {
    const response = await httpClient.post('/staff', data);
    return response.data;
  },

  update: async (data: StaffUpdateRequest): Promise<{ success: boolean }> => {
    const response = await httpClient.put('/staff', data);
    return response.data;
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    const response = await httpClient.delete(`/staff/${id}`);
    return response.data;
  }
};