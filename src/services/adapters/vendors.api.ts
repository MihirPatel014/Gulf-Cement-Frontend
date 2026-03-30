import { httpGet, httpDelete } from "../../lib/http/http-client";

export type VendorDto = {
  id: number
  vendorCode: string
  companyName: string
  contactPerson?: string
  email?: string
  phone?: string
  isActive: boolean
}

export const vendorApiService = {
  async getVendors() {
    const response = await httpGet<VendorDto[]>("/Vendor");
    return response;
  },

  async createVendor(payload: any) {
    const { httpPost } = await import("../../lib/http/http-client");
    return httpPost("/Vendor", payload);
  },

  async deleteVendor(id: number) {
    return httpDelete(`/Vendor/${id}`);
  },
};
