import { httpGet } from "../../lib/http/http-client";

export type VehicleDto = {
  id: number;
  plateNumber: string;
  vehicleType: string;
  maxCapacity: number;
  model?: string;
  isActive: boolean;
};

export const vehicleApiService = {
  async getAll() {
    return httpGet<VehicleDto[]>("/Vehicle");
  }
};
