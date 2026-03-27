export enum UserType {
  STAFF = 1,
  CUSTOMER = 2
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DISPATCH_AUTHORITY = 'DISPATCH_AUTHORITY',
  COMMAND_CONTROL_ROOM = 'COMMAND_CONTROL_ROOM',
  TRANSPORT_MANAGER = 'TRANSPORT_MANAGER',
  WEIGHBRIDGE_OPERATOR = 'WEIGHBRIDGE_OPERATOR',
  GATE_SECURITY = 'GATE_SECURITY',
  FINANCE_ACCOUNTS = 'FINANCE_ACCOUNTS',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.DISPATCH_AUTHORITY]: 'Dispatch Authority',
  [UserRole.COMMAND_CONTROL_ROOM]: 'Command Control Room',
  [UserRole.TRANSPORT_MANAGER]: 'Transport Manager',
  [UserRole.WEIGHBRIDGE_OPERATOR]: 'Weighbridge Operator',
  [UserRole.GATE_SECURITY]: 'Gate Security',
  [UserRole.FINANCE_ACCOUNTS]: 'Finance & Accounts',
  [UserRole.SYSTEM_ADMIN]: 'System Admin',
};

export enum OtpPurpose {
  EMAIL_VERIFY = 0,
  FORGOT_PASSWORD = 1
}

export enum CommunicationChannel {
  EMAIL = 0,
  SMS = 1
}

export interface User {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  role?: string;
  userType?: UserType;
}

export interface AuthResponse {
  success: boolean;
  message: string | null;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: User;
  };
}


export interface LoginRequest {
  userName: string;
  password: string;
  userType: UserType;
}

export interface OtpRequest {
  identifier: string;
  purpose: OtpPurpose;
  channel: CommunicationChannel;
}

export interface OtpVerifyRequest {
  identifier: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface ResetPasswordRequest {
  userName: string;
  newPassword: string;
}
