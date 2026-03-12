export enum UserType {
  STAFF = 1,
  CUSTOMER = 2
}

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
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
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
