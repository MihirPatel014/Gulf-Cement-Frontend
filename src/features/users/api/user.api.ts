
import httpClient from '../../../lib/http-client';
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UsersResponse,
  RolesResponse
} from '../types/user.types';

export const userApi = {
  getAll: async (): Promise<UsersResponse> => {
    const response = await httpClient.get('/user');
    return response.data;
  },

  getById: async (id: number): Promise<{ success: boolean; data: User }> => {
    const response = await httpClient.get(`/user/${id}`);
    return response.data;
  },

  create: async (data: UserCreateRequest): Promise<{ success: boolean; data: User }> => {
    const response = await httpClient.post('/user', data);
    return response.data;
  },

  update: async (data: UserUpdateRequest): Promise<{ success: boolean }> => {
    const response = await httpClient.put('/user', data);
    return response.data;
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    const response = await httpClient.delete(`/user/${id}`);
    return response.data;
  },

  getRoles: async (): Promise<RolesResponse> => {
    const response = await httpClient.get('/role');
    return response.data;
  }
};
