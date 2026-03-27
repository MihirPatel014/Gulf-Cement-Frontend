
export interface Address {
  id: number;
  entityType: string; // CUSTOMER or VENDOR
  entityId: number;
  addressType: string; // HOME, OFFICE, BILLING, SHIPPING, OTHER
  isPrimary: boolean;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateProvince: string | null;
  postalCode: string | null;
  country: string | null;
  isActive: boolean;
}

export interface AddressCreateRequest {
  entityType: string; // CUSTOMER or VENDOR
  entityId: number;
  addressType: string; // HOME, OFFICE, BILLING, SHIPPING, OTHER
  isPrimary?: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isActive?: boolean;
}

export interface AddressUpdateRequest {
  id: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface AddressesResponse {
  success: boolean;
  message: string | null;
  data: Address[];
}