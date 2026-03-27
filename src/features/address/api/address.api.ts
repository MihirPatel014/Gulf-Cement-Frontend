import httpClient from '../../../lib/http-client';
import {
  Address,
  AddressCreateRequest,
  AddressUpdateRequest,
  AddressesResponse
} from '../types/address.types';

export const addressApi = {
  getAll: async (): Promise<AddressesResponse> => {
    const response = await httpClient.get('/address');
    return response.data;
  },

  getById: async (id: number): Promise<{ success: boolean; data: Address }> => {
    const response = await httpClient.get(`/address/${id}`);
    return response.data;
  },

  getByEntity: async (entityType: string, entityId: number): Promise<AddressesResponse> => {
    const response = await httpClient.get(`/address/entity/${entityType}/${entityId}`);
    return response.data;
  },

  getPrimaryAddress: async (entityType: string, entityId: number): Promise<{ success: boolean; data: Address }> => {
    const response = await httpClient.get(`/address/primary/${entityType}/${entityId}`);
    return response.data;
  },

  setPrimaryAddress: async (addressId: number): Promise<{ success: boolean }> => {
    const response = await httpClient.post(`/address/set-primary/${addressId}`);
    return response.data;
  },

  getByType: async (entityType: string, entityId: number, addressType: string): Promise<AddressesResponse> => {
    const response = await httpClient.get(`/address/type/${entityType}/${entityId}/${addressType}`);
    return response.data;
  },

  create: async (data: AddressCreateRequest): Promise<{ success: boolean; data: Address }> => {
    const response = await httpClient.post('/address', data);
    return response.data;
  },

  update: async (data: AddressUpdateRequest): Promise<{ success: boolean }> => {
    const response = await httpClient.put('/address', data);
    return response.data;
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    const response = await httpClient.delete(`/address/${id}`);
    return response.data;
  }
};