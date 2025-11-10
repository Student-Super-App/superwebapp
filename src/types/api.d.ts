import { User } from './user';

// ==================== API Response Types ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ==================== Auth API Types ====================
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleSignInRequest {
  idToken: string;
}

export interface GoogleSignInResponse {
  user: User;
  accessToken: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LinkGoogleRequest {
  idToken: string;
}

// ==================== Health Check ====================
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

// ==================== Marketplace Types ====================
export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  images: string[];
  seller: User;
  status: 'active' | 'sold' | 'removed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  images?: string[];
}

// ==================== Printing Types ====================
export interface PrintOrder {
  _id: string;
  studentId: string;
  fileName: string;
  fileUrl: string;
  pages: number;
  copies: number;
  colorMode: 'bw' | 'color';
  paperSize: 'A4' | 'A3' | 'Letter';
  binding?: 'none' | 'staple' | 'spiral';
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrintOrderRequest {
  fileName: string;
  fileUrl: string;
  pages: number;
  copies: number;
  colorMode: 'bw' | 'color';
  paperSize: 'A4' | 'A3' | 'Letter';
  binding?: 'none' | 'staple' | 'spiral';
}

// ==================== Rentplace Types ====================
export interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'pg' | 'hostel' | 'apartment' | 'room';
  rent: number;
  deposit: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  images: string[];
  owner: User;
  capacity: number;
  occupancy: number;
  gender: 'male' | 'female' | 'any';
  foodIncluded: boolean;
  status: 'available' | 'occupied' | 'unavailable';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  type: 'pg' | 'hostel' | 'apartment' | 'room';
  rent: number;
  deposit: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  amenities: string[];
  images?: string[];
  capacity: number;
  gender: 'male' | 'female' | 'any';
  foodIncluded: boolean;
}
