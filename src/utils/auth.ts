import Cookies from 'js-cookie';

export const getAccessToken = (): string | undefined => {
  return Cookies.get('accessToken');
};

export const setAccessToken = (token: string): void => {
  Cookies.set('accessToken', token, { expires: 7 });
};

export const removeAccessToken = (): void => {
  Cookies.remove('accessToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const clearAuth = (): void => {
  removeAccessToken();
};
