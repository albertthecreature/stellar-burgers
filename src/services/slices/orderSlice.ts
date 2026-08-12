import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  orderInfo: TOrder | null;
  orderInfoLoading: boolean;
  orderInfoError: string | null;
};

type TOrderIngredientsState = {
  burgerConstructor: {
    bun: { _id: string } | null;
    ingredients: { _id: string }[];
  };
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  orderInfo: null,
  orderInfoLoading: false,
  orderInfoError: null
};

const getOrderIngredientsIds = (state: TOrderIngredientsState): string[] => {
  const { bun, ingredients } = state.burgerConstructor;

  if (!bun) {
    return [];
  }

  return [bun._id, ...ingredients.map((item) => item._id), bun._id];
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as TOrderIngredientsState;
    const ingredientsIds = getOrderIngredientsIds(state);

    if (!ingredientsIds.length) {
      return rejectWithValue('Добавьте булку и начинку');
    }

    try {
      const data = await orderBurgerApi(ingredientsIds);

      return {
        order: data.order,
        ingredients: ingredientsIds
      };
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Не удалось оформить заказ'
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);

      if (data.success && data.orders.length > 0) {
        return data.orders[0];
      }

      return rejectWithValue('Заказ не найден');
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Не удалось загрузить заказ'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
    clearOrderInfo: (state) => {
      state.orderInfo = null;
      state.orderInfoLoading = false;
      state.orderInfoError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        const { order, ingredients } = action.payload;

        state.orderRequest = false;
        state.orderModalData = {
          _id: order._id,
          status: order.status,
          name: order.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          number: order.number,
          ingredients
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = (action.payload as string) || 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderInfoLoading = true;
        state.orderInfoError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderInfoLoading = false;
        state.orderInfo = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderInfoLoading = false;
        state.orderInfoError = action.payload as string;
      });
  }
});

export const { closeOrderModal, clearOrderInfo } = orderSlice.actions;

export default orderSlice.reducer;
