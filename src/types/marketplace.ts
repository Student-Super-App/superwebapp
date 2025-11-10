// Product Types
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  views: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchParams {
  q?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  condition?: string;
  images?: string[];
  isAvailable?: boolean;
}

// Analytics Types
export interface ProductStats {
  totalProducts: number;
  totalViews: number;
  averagePrice: number;
  categoryCounts: Record<string, number>;
}

export interface CategoryStats {
  category: string;
  count: number;
  averagePrice: number;
  totalViews: number;
}

export interface TrendingProduct extends Product {
  trendingScore: number;
}

// Chat Types
export interface Chat {
  _id: string;
  product: Product;
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lastMessage?: Message;
  unreadCount: number;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  message: string;
  messageType: 'text' | 'image';
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageData {
  message: string;
  messageType: 'text' | 'image';
  imageUrl?: string;
}

export interface ChatStats {
  totalChats: number;
  activeChats: number;
  archivedChats: number;
  unreadMessages: number;
}

export interface ChatFilters {
  page?: number;
  limit?: number;
  status?: 'active' | 'archived';
}

export interface MessageFilters {
  page?: number;
  limit?: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Books',
  'Furniture',
  'Clothing',
  'Sports',
  'Musical Instruments',
  'Other',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Product Conditions
export const PRODUCT_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
] as const;

export type ProductCondition = typeof PRODUCT_CONDITIONS[number];
