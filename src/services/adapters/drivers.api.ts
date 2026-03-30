import { httpGet } from "../../lib/http/http-client";

export type DriverDto = {
  id: number;
  fullName: string;
  licenseNumber: string;
  phone?: string;
  identityNumber?: string;
  isActive: boolean;
};

export const driverApiService = {
  async getAll() {
    return httpGet<DriverDto[]>("/Driver");
  }
};
