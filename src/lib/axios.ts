import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const { accessToken } = response.data.data;
        
        // Save new token
        Cookies.set('accessToken', accessToken, { expires: 7 });

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        
        // Clear tokens and redirect to login
        Cookies.remove('accessToken');
        
        // Redirect to login if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
