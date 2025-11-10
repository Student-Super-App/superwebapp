'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const initialized = useRef(false);

  // Initialize auth only once on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(initializeAuth());
    }
  }, [dispatch]);

  // Redirect to login if not authenticated (after loading completes)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && initialized.current) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Always render children, even during loading
  // This prevents the "blink" effect
  return <>{children}</>;
};
