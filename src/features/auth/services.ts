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


const AUTH_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export const authApi = {
  // Registration & Login
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<RegisterResponse>>(`${AUTH_BASE}/api/auth/register`, data),
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>(`${AUTH_BASE}/api/auth/login`, data),

  logout: () =>
    api.post<ApiResponse>(`${AUTH_BASE}/api/auth/logout`),

  logoutAll: () =>
    api.post<ApiResponse>(`${AUTH_BASE}/api/auth/logout-all`),

  // Token Management
  refreshToken: () =>
    api.post<ApiResponse<RefreshTokenResponse>>(`${AUTH_BASE}/api/auth/refresh-token`),
  // Email Verification
  verifyEmail: (token: string) =>
    api.get<ApiResponse>(`${AUTH_BASE}/api/auth/verify-email/${token}`),

  resendVerification: (data: ResendVerificationRequest) =>
    api.post<ApiResponse>(`${AUTH_BASE}/api/auth/resend-verification`, data),

  // Password Management
  requestPasswordReset: (data: RequestPasswordResetRequest) =>
    api.post<ApiResponse>(`${AUTH_BASE}/api/auth/request-password-reset`, data),
  resetPassword: (token: string, data: ResetPasswordRequest) =>
    api.post<ApiResponse>(`${AUTH_BASE}/api/auth/reset-password/${token}`, data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<ApiResponse>(`${AUTH_BASE}/api/auth/change-password`, data),

  // Profile Management
  getProfile: () =>
    api.get<ApiResponse<User>>(`${AUTH_BASE}/api/auth/profile`),
  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<User>>(`${AUTH_BASE}/api/auth/profile`, data),

  // Google OAuth
  getGoogleAuthUrl: () =>
    api.get<ApiResponse<{ url: string }>>(`${AUTH_BASE}/api/auth/google/url`),
  googleSignIn: (data: GoogleSignInRequest) =>
    api.post<ApiResponse<GoogleSignInResponse>>(`${AUTH_BASE}/api/auth/google/signin`, data),

  linkGoogle: (data: LinkGoogleRequest) =>
    api.post<ApiResponse>(`${AUTH_BASE}/api/auth/google/link`, data),

  unlinkGoogle: () =>
    api.delete<ApiResponse>(`${AUTH_BASE}/api/auth/google/unlink`),

  // Health Check
  healthCheck: () =>
    api.get<ApiResponse<HealthCheckResponse>>(`${AUTH_BASE}/health`),
};
