import api from '@/lib/axios';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  GoogleSignInRequest,
  GoogleSignInResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ResendVerificationRequest,
  LinkGoogleRequest,
  HealthCheckResponse,
} from '@/types/api';
import { User } from '@/types/user';

export const authApi = {
  // Registration & Login
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<RegisterResponse>>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>('/api/auth/login', data),

  logout: () =>
    api.post<ApiResponse>('/api/auth/logout'),

  logoutAll: () =>
    api.post<ApiResponse>('/api/auth/logout-all'),

  // Token Management
  refreshToken: () =>
    api.post<ApiResponse<RefreshTokenResponse>>('/api/auth/refresh-token'),

  // Email Verification
  verifyEmail: (token: string) =>
    api.get<ApiResponse>(`/api/auth/verify-email/${token}`),

  resendVerification: (data: ResendVerificationRequest) =>
    api.post<ApiResponse>('/api/auth/resend-verification', data),

  // Password Management
  requestPasswordReset: (data: RequestPasswordResetRequest) =>
    api.post<ApiResponse>('/api/auth/request-password-reset', data),

  resetPassword: (token: string, data: ResetPasswordRequest) =>
    api.post<ApiResponse>(`/api/auth/reset-password/${token}`, data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<ApiResponse>('/api/auth/change-password', data),

  // Profile Management
  getProfile: () =>
    api.get<ApiResponse<User>>('/api/auth/profile'),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<User>>('/api/auth/profile', data),

  // Google OAuth
  getGoogleAuthUrl: () =>
    api.get<ApiResponse<{ url: string }>>('/api/auth/google/url'),

  googleSignIn: (data: GoogleSignInRequest) =>
    api.post<ApiResponse<GoogleSignInResponse>>('/api/auth/google/signin', data),

  linkGoogle: (data: LinkGoogleRequest) =>
    api.post<ApiResponse>('/api/auth/google/link', data),

  unlinkGoogle: () =>
    api.delete<ApiResponse>('/api/auth/google/unlink'),

  // Health Check
  healthCheck: () =>
    api.get<ApiResponse<HealthCheckResponse>>('/health'),
};
