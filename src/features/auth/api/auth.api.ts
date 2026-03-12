import httpClient from '../../../lib/http-client';
import { 
  AuthResponse, 
  LoginRequest, 
  OtpRequest, 
  OtpVerifyRequest, 
  ResetPasswordRequest 
} from '../types/auth.types';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await httpClient.post(AUTH_CONSTANTS.ENDPOINTS.LOGIN, data);
    return response.data;
  },

  register: async (data: any): Promise<AuthResponse> => {
    const response = await httpClient.post('/auth/register', data);
    return response.data;
  },

  refreshToken: async (token: string): Promise<AuthResponse> => {
    const response = await httpClient.post(AUTH_CONSTANTS.ENDPOINTS.REFRESH, { refreshToken: token });
    return response.data.data;
  },

  requestOtp: async (data: OtpRequest): Promise<void> => {
    await httpClient.post(AUTH_CONSTANTS.ENDPOINTS.OTP_REQUEST, data);
  },

  verifyOtp: async (data: OtpVerifyRequest): Promise<void> => {
    await httpClient.post(AUTH_CONSTANTS.ENDPOINTS.OTP_VERIFY, data);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await httpClient.post(AUTH_CONSTANTS.ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await httpClient.post(AUTH_CONSTANTS.ENDPOINTS.RESET_PASSWORD, data);
  }
};
