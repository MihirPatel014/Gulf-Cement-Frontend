import { httpGet } from "../../lib/http/http-client";

export type CustomerDto = {
  id: number
  customerCode: string
  companyName: string
}

export const customerApiService = {
  async getCustomers() {
    const response = await httpGet<CustomerDto[]>("/orders/customers");
    return response;
  },
};