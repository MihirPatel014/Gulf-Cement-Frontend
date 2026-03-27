export interface Driver {
  id: number;
  fullName: string;
  licenseNumber: string;
  phone: string | null;
  identityNumber: string | null;
  isActive: boolean;
}

export interface DriverCreateRequest {
  fullName: string;
  licenseNumber: string;
  phone?: string;
  identityNumber?: string;
}

export interface DriverUpdateRequest extends DriverCreateRequest {
  id: number;
  isActive: boolean;
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: string;
  maxCapacity: number;
  model: string | null;
  isActive: boolean;
}

export interface VehicleCreateRequest {
  plateNumber: string;
  vehicleType: string;
  maxCapacity: number;
  model?: string;
}

export interface VehicleUpdateRequest extends VehicleCreateRequest {
  id: number;
  isActive: boolean;
}
