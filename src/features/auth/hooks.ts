import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './services';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setUser, logout as logoutAction } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/error';
import type { User } from '@/types/user';

// ==================== Auth Mutations ====================

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data!;
      dispatch(setCredentials({ user, accessToken }));
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data!;
      dispatch(setCredentials({ user, accessToken }));
      toast.success('Registration successful!');
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: unknown) => {
      // Still logout locally even if API fails
      dispatch(logoutAction());
      queryClient.clear();
      router.push('/login');
      toast.error(getErrorMessage(error));
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.requestPasswordReset,
    onSuccess: () => {
      toast.success('Password reset link sent to your email!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, { password }),
    onSuccess: () => {
      toast.success('Password reset successful! Please login.');
      router.push('/login');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      dispatch(setUser(response.data.data!));
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useVerifyEmail = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (response) => {
      if (response.data.data) {
        dispatch(setUser(response.data.data as User));
      }
      toast.success('Email verified successfully!');
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ==================== Auth Queries ====================

export const useProfile = (enabled = true) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authApi.getProfile();
      const user = response.data.data!;
      dispatch(setUser(user));
      return user;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
