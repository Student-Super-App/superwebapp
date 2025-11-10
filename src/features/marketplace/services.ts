import axios from 'axios';
import Cookies from 'js-cookie';
import type {
  Product,
  ProductFilters,
  ProductSearchParams,
  CreateProductData,
  UpdateProductData,
  Chat,
  ChatFilters,
  Message,
  MessageFilters,
  SendMessageData,
  ProductStats,
  CategoryStats,
  TrendingProduct,
  ChatStats,
  PaginatedResponse,
  SingleResponse,
} from '@/types/marketplace';

const MARKETPLACE_BASE_URL = process.env.NEXT_PUBLIC_MARKETPLACE_URL || 'http://localhost:3002';

// Create marketplace-specific axios instance
const marketplaceApi = axios.create({
  baseURL: MARKETPLACE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
marketplaceApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
marketplaceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      // Log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Marketplace API Error:', {
          status,
          message,
          url: error.config?.url,
        });
      }

      // Handle unauthorized errors
      if (status === 401) {
        // Token might be expired, but don't auto-logout from here
        // Let the component handle it
        console.warn('Unauthorized marketplace request');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Product APIs
export const productApi = {
  // Get all products with filters (no auth required)
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const { data } = await marketplaceApi.get(
      `/api/products?${params.toString()}`
    );
    return data;
  },

  // Get product by ID (no auth required)
  getById: async (id: string): Promise<SingleResponse<Product>> => {
    const { data } = await marketplaceApi.get(`/api/products/${id}`);
    return data;
  },

  // Search products
  search: async (params: ProductSearchParams): Promise<PaginatedResponse<Product>> => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.category) searchParams.append('category', params.category);
    if (params.condition) searchParams.append('condition', params.condition);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.location) searchParams.append('location', params.location);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const { data } = await marketplaceApi.get(
      `/api/products/search?${searchParams.toString()}`
    );
    return data;
  },

  // Create product (auth required)
  create: async (productData: CreateProductData): Promise<SingleResponse<Product>> => {
    const { data } = await marketplaceApi.post(`/api/products`, productData);
    return data;
  },

  // Update product (auth required)
  update: async (id: string, productData: UpdateProductData): Promise<SingleResponse<Product>> => {
    const { data } = await marketplaceApi.put(`/api/products/${id}`, productData);
    return data;
  },

  // Delete product (auth required)
  delete: async (id: string): Promise<SingleResponse<void>> => {
    const { data } = await marketplaceApi.delete(`/api/products/${id}`);
    return data;
  },

  // Get my products (auth required)
  getMyProducts: async (): Promise<PaginatedResponse<Product>> => {
    const { data } = await marketplaceApi.get(`/api/products/user/my-products`);
    return data;
  },

  // Increment product views
  incrementViews: async (id: string): Promise<SingleResponse<void>> => {
    const { data } = await marketplaceApi.post(`/api/products/${id}/view`);
    return data;
  },
};

// Analytics APIs
export const analyticsApi = {
  // Get product statistics
  getStats: async (): Promise<SingleResponse<ProductStats>> => {
    const { data } = await marketplaceApi.get(`/api/products/analytics/stats`);
    return data;
  },

  // Get trending products
  getTrending: async (limit?: number, category?: string): Promise<PaginatedResponse<TrendingProduct>> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (category) params.append('category', category);

    const { data } = await marketplaceApi.get(
      `/api/products/analytics/trending?${params.toString()}`
    );
    return data;
  },

  // Get category statistics
  getCategoryStats: async (): Promise<PaginatedResponse<CategoryStats>> => {
    const { data} = await marketplaceApi.get(`/api/products/analytics/categories`);
    return data;
  },

  // Get similar products
  getSimilar: async (id: string, limit?: number): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    const { data } = await marketplaceApi.get(
      `/api/products/${id}/similar?${params.toString()}`
    );
    return data;
  },

  // Get search suggestions
  getSearchSuggestions: async (query: string, limit?: number): Promise<SingleResponse<string[]>> => {
    const params = new URLSearchParams();
    params.append('query', query);
    if (limit) params.append('limit', limit.toString());

    const { data } = await marketplaceApi.get(
      `/api/products/search/suggestions?${params.toString()}`
    );
    return data;
  },
};

// Chat APIs
export const chatApi = {
  // Create or get chat for a product (auth required)
  createOrGet: async (productId: string): Promise<SingleResponse<Chat>> => {
    const { data } = await marketplaceApi.post(`/api/chat/${productId}`);
    return data;
  },

  // Get user chats (auth required)
  getUserChats: async (filters?: ChatFilters): Promise<PaginatedResponse<Chat>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);

    const { data } = await marketplaceApi.get(
      `/api/chat?${params.toString()}`
    );
    return data;
  },

  // Get chat statistics (auth required)
  getStats: async (): Promise<SingleResponse<ChatStats>> => {
    const { data } = await marketplaceApi.get(`/api/chat/stats`);
    return data;
  },

  // Get chat by ID (auth required)
  getById: async (chatId: string): Promise<SingleResponse<Chat>> => {
    const { data } = await marketplaceApi.get(`/api/chat/${chatId}`);
    return data;
  },

  // Get chat messages (auth required)
  getMessages: async (chatId: string, filters?: MessageFilters): Promise<PaginatedResponse<Message>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const { data } = await marketplaceApi.get(
      `/api/chat/${chatId}/messages?${params.toString()}`
    );
    return data;
  },

  // Send message (auth required)
  sendMessage: async (chatId: string, messageData: SendMessageData): Promise<SingleResponse<Message>> => {
    const { data } = await marketplaceApi.post(
      `/api/chat/${chatId}/messages`,
      messageData
    );
    return data;
  },

  // Mark messages as read (auth required)
  markAsRead: async (chatId: string, messageIds: string[]): Promise<SingleResponse<void>> => {
    const { data } = await marketplaceApi.put(`/api/chat/${chatId}/read`, {
      messageIds,
    });
    return data;
  },

  // Archive chat (auth required)
  archive: async (chatId: string): Promise<SingleResponse<void>> => {
    const { data } = await marketplaceApi.delete(`/api/chat/${chatId}`);
    return data;
  },
};
