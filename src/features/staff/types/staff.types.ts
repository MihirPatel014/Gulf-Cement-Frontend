export interface Staff {
  id: number;
  userId: number;
  employeeCode: string | null;
  department: string | null;
  positionTitle: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateProvince: string | null;
  postalCode: string | null;
  country: string | null;
  isActive: boolean;
}

export interface StaffCreateRequest {
  userId: number;
  employeeCode?: string;
  department?: string;
  positionTitle?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isActive?: boolean;
}

export interface StaffUpdateRequest {
  id: number;
  userId?: number;
  employeeCode?: string;
  department?: string;
  positionTitle?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  isActive?: boolean;
}

export interface StaffsResponse {
  success: boolean;
  message: string | null;
  data: Staff[];
}