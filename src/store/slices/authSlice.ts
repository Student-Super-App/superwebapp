import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      // Save to cookies and localStorage
      Cookies.set('accessToken', action.payload.accessToken, { expires: 7 });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // Update localStorage when user is updated
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Clear cookies and localStorage
      Cookies.remove('accessToken');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    initializeAuth: (state) => {
      const token = Cookies.get('accessToken');
      if (token) {
        state.accessToken = token;
        state.isAuthenticated = true;
        
        // Restore user from localStorage
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              state.user = JSON.parse(storedUser);
            } catch (error) {
              console.error('Failed to parse stored user:', error);
            }
          }
        }
      }
      state.isLoading = false;
    },
  },
});

export const { setCredentials, setUser, logout, setLoading, initializeAuth } =
  authSlice.actions;

export default authSlice.reducer;
