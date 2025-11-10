import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RentplaceState {
  filters: {
    type: string;
    minRent: number;
    maxRent: number;
    gender: string;
    foodIncluded: boolean | null;
    search: string;
  };
  isAddingProperty: boolean;
  selectedPropertyId: string | null;
}

const initialState: RentplaceState = {
  filters: {
    type: 'all',
    minRent: 0,
    maxRent: 0,
    gender: 'all',
    foodIncluded: null,
    search: '',
  },
  isAddingProperty: false,
  selectedPropertyId: null,
};

const rentplaceSlice = createSlice({
  name: 'rentplace',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<RentplaceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setAddingProperty: (state, action: PayloadAction<boolean>) => {
      state.isAddingProperty = action.payload;
    },
    setSelectedProperty: (state, action: PayloadAction<string | null>) => {
      state.selectedPropertyId = action.payload;
    },
  },
});

export const { setFilters, resetFilters, setAddingProperty, setSelectedProperty } =
  rentplaceSlice.actions;

export default rentplaceSlice.reducer;
