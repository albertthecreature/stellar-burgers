import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

type TFeedData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return {
        orders: data.orders,
        total: data.total,
        totalToday: data.totalToday
      };
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Не удалось загрузить ленту'
      );
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    updateFeedData: (state, action: PayloadAction<TFeedData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { updateFeedData } = feedSlice.actions;

export default feedSlice.reducer;

export const getFeedWsUrl = (): string =>
  process.env
    .BURGER_API_URL!.replace(/^https/, 'wss')
    .replace(/\/api$/, '/orders');
