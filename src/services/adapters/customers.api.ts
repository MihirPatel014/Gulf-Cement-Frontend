import { httpGet, httpDelete } from "../../lib/http/http-client";

export type CustomerDto = {
  id: number
  customerCode: string
  companyName: string
  email?: string
  phone?: string
  isActive: boolean
}

export const customerApiService = {
  async getCustomers(pageSize?: number) {
    const url = pageSize ? `/Customer?pageSize=${pageSize}` : "/Customer";
    const response = await httpGet<CustomerDto[]>(url);
    return response;
  },

  async createCustomer(payload: any) {
    const { httpPost } = await import("../../lib/http/http-client");
    return httpPost("/Customer", payload);
  },

  async deleteCustomer(id: number) {
    return httpDelete(`/Customer/${id}`);
  },
};