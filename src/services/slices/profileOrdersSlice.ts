import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { getCookie } from '../../utils/cookie';
import { TOrder } from '@utils-types';
import { getFeedWsUrl } from './feedSlice';

export type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message ||
          'Не удалось загрузить историю заказов'
      );
    }
  }
);

export const getProfileOrdersWsUrl = (): string => {
  const token = getCookie('accessToken');
  return `${getFeedWsUrl()}?token=${token}`;
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    updateProfileOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { updateProfileOrders } = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
