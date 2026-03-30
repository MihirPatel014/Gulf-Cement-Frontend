import { httpGet } from "../../lib/http/http-client";

export type AddressDto = {
  id: number;
  entityType: string;
  entityId: number;
  addressType: string;
  isPrimary: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isActive: boolean;
};

export const addressApiService = {
  async getByEntity(entityType: string, entityId: number) {
    return httpGet<AddressDto[]>(`/Address/entity-addresses/${entityType}/${entityId}`);
  }
};

