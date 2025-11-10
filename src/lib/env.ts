/**
 * Environment Configuration Validator
 * Ensures all required environment variables are present
 */

const requiredEnvVars = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
} as const;

export function validateEnv() {
  const missing: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\nPlease check your .env.local file.`
    );
  }

  // Validate URLs
  try {
    new URL(requiredEnvVars.NEXT_PUBLIC_API_BASE_URL!);
  } catch {
    throw new Error('NEXT_PUBLIC_API_BASE_URL must be a valid URL');
  }

  try {
    new URL(requiredEnvVars.NEXT_PUBLIC_SOCKET_URL!);
  } catch {
    throw new Error('NEXT_PUBLIC_SOCKET_URL must be a valid URL');
  }
}

export const env = {
  apiBaseUrl: requiredEnvVars.NEXT_PUBLIC_API_BASE_URL,
  socketUrl: requiredEnvVars.NEXT_PUBLIC_SOCKET_URL,
  environment: requiredEnvVars.NEXT_PUBLIC_ENV,
  isDevelopment: requiredEnvVars.NEXT_PUBLIC_ENV === 'development',
  isProduction: requiredEnvVars.NEXT_PUBLIC_ENV === 'production',
} as const;

// Validate on module load
if (typeof window === 'undefined') {
  // Only validate on server side to avoid client-side errors
  try {
    validateEnv();
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}
