import httpClient from '../../../lib/http-client';
import { DriverCreateRequest, DriverUpdateRequest, VehicleCreateRequest, VehicleUpdateRequest } from '../types/transport.types';

export const transportApi = {
  // DRIVERS
  getDrivers: async () => {
    const res = await httpClient.get<any>('/driver');
    return res.data;
  },
  getPaginatedDrivers: async (page: number, size: number, search?: string) => {
    const res = await httpClient.get<any>(`/driver/paginated-data?pageNumber=${page}&pageSize=${size}&search=${search || ''}`);
    return res.data;
  },
  getDriver: async (id: number) => {
    const res = await httpClient.get<any>(`/driver/${id}`);
    return res.data;
  },
  createDriver: async (data: DriverCreateRequest) => {
    const res = await httpClient.post<any>('/driver', data);
    return res.data;
  },
  updateDriver: async (data: DriverUpdateRequest) => {
    const res = await httpClient.put<any>('/driver', data);
    return res.data;
  },
  deleteDriver: async (id: number) => {
    const res = await httpClient.delete<any>(`/driver/${id}`);
    return res.data;
  },

  // VEHICLES
  getVehicles: async () => {
    const res = await httpClient.get<any>('/vehicle');
    return res.data;
  },
  getPaginatedVehicles: async (page: number, size: number, search?: string) => {
    const res = await httpClient.get<any>(`/vehicle/paginated-data?pageNumber=${page}&pageSize=${size}&search=${search || ''}`);
    return res.data;
  },
  getVehicle: async (id: number) => {
    const res = await httpClient.get<any>(`/vehicle/${id}`);
    return res.data;
  },
  createVehicle: async (data: VehicleCreateRequest) => {
    const res = await httpClient.post<any>('/vehicle', data);
    return res.data;
  },
  updateVehicle: async (data: VehicleUpdateRequest) => {
    const res = await httpClient.put<any>('/vehicle', data);
    return res.data;
  },
  deleteVehicle: async (id: number) => {
    const res = await httpClient.delete<any>(`/vehicle/${id}`);
    return res.data;
  },
};
