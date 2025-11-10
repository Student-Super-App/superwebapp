import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PrintingState {
  currentOrder: {
    colorMode: 'bw' | 'color';
    paperSize: 'A4' | 'A3' | 'Letter';
    binding: 'none' | 'staple' | 'spiral';
    copies: number;
  };
  selectedOrderId: string | null;
  isCreatingOrder: boolean;
}

const initialState: PrintingState = {
  currentOrder: {
    colorMode: 'bw',
    paperSize: 'A4',
    binding: 'none',
    copies: 1,
  },
  selectedOrderId: null,
  isCreatingOrder: false,
};

const printingSlice = createSlice({
  name: 'printing',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Partial<PrintingState['currentOrder']>>) => {
      state.currentOrder = { ...state.currentOrder, ...action.payload };
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = initialState.currentOrder;
    },
    setSelectedOrder: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderId = action.payload;
    },
    setCreatingOrder: (state, action: PayloadAction<boolean>) => {
      state.isCreatingOrder = action.payload;
    },
  },
});

export const { setCurrentOrder, resetCurrentOrder, setSelectedOrder, setCreatingOrder } =
  printingSlice.actions;

export default printingSlice.reducer;
