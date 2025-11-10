import api from '@/lib/axios';
import {
  ApiResponse,
  Listing,
  CreateListingRequest,
  PrintOrder,
  CreatePrintOrderRequest,
  Property,
  CreatePropertyRequest,
} from '@/types/api';

// ==================== Marketplace API ====================
export const marketplaceApi = {
  getListings: (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    search?: string;
  }) =>
    api.get<ApiResponse<Listing[]>>('/api/marketplace/listings', { params }),

  getListing: (id: string) =>
    api.get<ApiResponse<Listing>>(`/api/marketplace/listings/${id}`),

  createListing: (data: CreateListingRequest) =>
    api.post<ApiResponse<Listing>>('/api/marketplace/listings', data),

  updateListing: (id: string, data: Partial<CreateListingRequest>) =>
    api.put<ApiResponse<Listing>>(`/api/marketplace/listings/${id}`, data),

  deleteListing: (id: string) =>
    api.delete<ApiResponse>(`/api/marketplace/listings/${id}`),

  getMyListings: () =>
    api.get<ApiResponse<Listing[]>>('/api/marketplace/my-listings'),
};

// ==================== Printing API ====================
export const printingApi = {
  getOrders: () =>
    api.get<ApiResponse<PrintOrder[]>>('/api/printing/orders'),

  getOrder: (id: string) =>
    api.get<ApiResponse<PrintOrder>>(`/api/printing/orders/${id}`),

  createOrder: (data: CreatePrintOrderRequest) =>
    api.post<ApiResponse<PrintOrder>>('/api/printing/orders', data),

  cancelOrder: (id: string) =>
    api.post<ApiResponse>(`/api/printing/orders/${id}/cancel`),

  getMyOrders: () =>
    api.get<ApiResponse<PrintOrder[]>>('/api/printing/my-orders'),
};

// ==================== Rentplace API ====================
export const rentplaceApi = {
  getProperties: (params?: {
    type?: string;
    minRent?: number;
    maxRent?: number;
    gender?: string;
    foodIncluded?: boolean;
    search?: string;
  }) =>
    api.get<ApiResponse<Property[]>>('/api/rentplace/properties', { params }),

  getProperty: (id: string) =>
    api.get<ApiResponse<Property>>(`/api/rentplace/properties/${id}`),

  createProperty: (data: CreatePropertyRequest) =>
    api.post<ApiResponse<Property>>('/api/rentplace/properties', data),

  updateProperty: (id: string, data: Partial<CreatePropertyRequest>) =>
    api.put<ApiResponse<Property>>(`/api/rentplace/properties/${id}`, data),

  deleteProperty: (id: string) =>
    api.delete<ApiResponse>(`/api/rentplace/properties/${id}`),

  getMyProperties: () =>
    api.get<ApiResponse<Property[]>>('/api/rentplace/my-properties'),
};
