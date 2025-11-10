import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MarketplaceState {
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    condition: string;
    search: string;
  };
  isCreatingListing: boolean;
  selectedListingId: string | null;
}

const initialState: MarketplaceState = {
  filters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 0,
    condition: 'all',
    search: '',
  },
  isCreatingListing: false,
  selectedListingId: null,
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MarketplaceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCreatingListing: (state, action: PayloadAction<boolean>) => {
      state.isCreatingListing = action.payload;
    },
    setSelectedListing: (state, action: PayloadAction<string | null>) => {
      state.selectedListingId = action.payload;
    },
  },
});

export const { setFilters, resetFilters, setCreatingListing, setSelectedListing } =
  marketplaceSlice.actions;

export default marketplaceSlice.reducer;
