import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import printingReducer from './slices/printingSlice';
import rentplaceReducer from './slices/rentplaceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    marketplace: marketplaceReducer,
    printing: printingReducer,
    rentplace: rentplaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
