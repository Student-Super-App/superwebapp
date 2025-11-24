'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';
import { Loader } from '@/components/common/Loader';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <Loader />;
}
