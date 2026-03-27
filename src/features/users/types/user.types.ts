import { UserType } from '../../auth/types/auth.types';

export interface User {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  role: string | null;
  roleId: number;
  userType: UserType;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface UserCreateRequest {
  fullName: string;
  userName: string;
  email: string;
  password?: string;
  roleId: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

export interface UserUpdateRequest {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  roleId: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

export interface UsersResponse {
  success: boolean;
  message: string | null;
  data: User[];
}

export interface RolesResponse {
  success: boolean;
  message: string | null;
  data: Role[];
}
