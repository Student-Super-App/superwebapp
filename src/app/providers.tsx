'use client';

import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { queryClient } from '@/lib/queryClient';
import { SocketProvider } from '@/lib/socket';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthGuard } from '@/components/AuthGuard';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <SocketProvider>
              <AuthGuard>

              {children}
              </AuthGuard>
              <Toaster position="top-right" richColors />
            </SocketProvider>
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
