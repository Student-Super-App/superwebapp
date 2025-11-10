import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { productApi, analyticsApi, chatApi } from './services';
import type {
  ProductFilters,
  ProductSearchParams,
  CreateProductData,
  UpdateProductData,
  ChatFilters,
  MessageFilters,
  SendMessageData,
} from '@/types/marketplace';

// Error type for API responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (error: unknown): string => {
  return (error as ApiError).response?.data?.message || 'An error occurred';
};

// Query Keys
export const marketplaceKeys = {
  all: ['marketplace'] as const,
  products: () => [...marketplaceKeys.all, 'products'] as const,
  productsList: (filters?: ProductFilters) => [...marketplaceKeys.products(), 'list', filters] as const,
  productDetail: (id: string) => [...marketplaceKeys.products(), 'detail', id] as const,
  productSearch: (params: ProductSearchParams) => [...marketplaceKeys.products(), 'search', params] as const,
  myProducts: () => [...marketplaceKeys.products(), 'my-products'] as const,
  
  analytics: () => [...marketplaceKeys.all, 'analytics'] as const,
  stats: () => [...marketplaceKeys.analytics(), 'stats'] as const,
  trending: (limit?: number, category?: string) => [...marketplaceKeys.analytics(), 'trending', { limit, category }] as const,
  categoryStats: () => [...marketplaceKeys.analytics(), 'categories'] as const,
  similar: (id: string, limit?: number) => [...marketplaceKeys.analytics(), 'similar', id, limit] as const,
  suggestions: (query: string) => [...marketplaceKeys.analytics(), 'suggestions', query] as const,
  
  chats: () => [...marketplaceKeys.all, 'chats'] as const,
  chatsList: (filters?: ChatFilters) => [...marketplaceKeys.chats(), 'list', filters] as const,
  chatDetail: (id: string) => [...marketplaceKeys.chats(), 'detail', id] as const,
  chatMessages: (chatId: string, filters?: MessageFilters) => [...marketplaceKeys.chats(), chatId, 'messages', filters] as const,
  chatStats: () => [...marketplaceKeys.chats(), 'stats'] as const,
};

// ==================== PRODUCT HOOKS ====================

// Get all products (public)
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: marketplaceKeys.productsList(filters),
    queryFn: () => productApi.getAll(filters),
    staleTime: 30000, // 30 seconds
  });
};

// Get product by ID (public)
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: marketplaceKeys.productDetail(id),
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

// Search products
export const useProductSearch = (params: ProductSearchParams) => {
  return useQuery({
    queryKey: marketplaceKeys.productSearch(params),
    queryFn: () => productApi.search(params),
    enabled: !!params.q || !!params.category,
    staleTime: 30000,
  });
};

// Get my products (auth required)
export const useMyProducts = () => {
  return useQuery({
    queryKey: marketplaceKeys.myProducts(),
    queryFn: () => productApi.getMyProducts(),
  });
};

// Create product
export const useCreateProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => productApi.create(data),
    onSuccess: (response) => {
      toast.success('Product listed successfully!');
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.products() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myProducts() });
      router.push(`/marketplace/${response.data._id}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to create product');
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productApi.update(id, data),
    onSuccess: (response, variables) => {
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.productDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myProducts() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.products() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to update product');
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.products() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myProducts() });
      router.push('/marketplace/my-listings');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to delete product');
    },
  });
};

// Increment product views
export const useIncrementViews = () => {
  return useMutation({
    mutationFn: (id: string) => productApi.incrementViews(id),
    // Silent operation, no toast
  });
};

// ==================== ANALYTICS HOOKS ====================

// Get product statistics
export const useProductStats = () => {
  return useQuery({
    queryKey: marketplaceKeys.stats(),
    queryFn: () => analyticsApi.getStats(),
  });
};

// Get trending products
export const useTrendingProducts = (limit?: number, category?: string) => {
  return useQuery({
    queryKey: marketplaceKeys.trending(limit, category),
    queryFn: () => analyticsApi.getTrending(limit, category),
    staleTime: 60000, // 1 minute
  });
};

// Get category statistics
export const useCategoryStats = () => {
  return useQuery({
    queryKey: marketplaceKeys.categoryStats(),
    queryFn: () => analyticsApi.getCategoryStats(),
    staleTime: 300000, // 5 minutes
  });
};

// Get similar products
export const useSimilarProducts = (id: string, limit?: number) => {
  return useQuery({
    queryKey: marketplaceKeys.similar(id, limit),
    queryFn: () => analyticsApi.getSimilar(id, limit),
    enabled: !!id,
    retry: false, // Don't retry if endpoint doesn't exist
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get search suggestions
export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: marketplaceKeys.suggestions(query),
    queryFn: () => analyticsApi.getSearchSuggestions(query, 10),
    enabled: query.length >= 2,
    staleTime: 60000,
  });
};

// ==================== CHAT HOOKS ====================

// Create or get chat
export const useCreateChat = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => chatApi.createOrGet(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chats() });
      router.push(`/marketplace/chats/${response.data._id}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to start chat');
    },
  });
};

// Get user chats
export const useChats = (filters?: ChatFilters) => {
  return useQuery({
    queryKey: marketplaceKeys.chatsList(filters),
    queryFn: () => chatApi.getUserChats(filters),
  });
};

// Get chat by ID
export const useChat = (chatId: string) => {
  return useQuery({
    queryKey: marketplaceKeys.chatDetail(chatId),
    queryFn: () => chatApi.getById(chatId),
    enabled: !!chatId,
  });
};

// Get chat messages
export const useChatMessages = (chatId: string, filters?: MessageFilters) => {
  return useQuery({
    queryKey: marketplaceKeys.chatMessages(chatId, filters),
    queryFn: () => chatApi.getMessages(chatId, filters),
    enabled: !!chatId,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });
};

// Get chat stats
export const useChatStats = () => {
  return useQuery({
    queryKey: marketplaceKeys.chatStats(),
    queryFn: () => chatApi.getStats(),
  });
};

// Send message
export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageData) => chatApi.sendMessage(chatId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chatMessages(chatId) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chatDetail(chatId) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chats() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to send message');
    },
  });
};

// Mark messages as read
export const useMarkAsRead = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageIds: string[]) => chatApi.markAsRead(chatId, messageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chatMessages(chatId) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chatDetail(chatId) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chats() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chatStats() });
    },
  });
};

// Archive chat
export const useArchiveChat = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => chatApi.archive(chatId),
    onSuccess: () => {
      toast.success('Chat archived successfully');
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chats() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.chatStats() });
      router.push('/marketplace/chats');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to archive chat');
    },
  });
};
