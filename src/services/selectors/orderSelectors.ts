import { RootState } from '../store';

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const selectOrderError = (state: RootState) => state.order.error;

export const selectOrderInfo = (state: RootState) => state.order.orderInfo;

export const selectOrderInfoLoading = (state: RootState) =>
  state.order.orderInfoLoading;

export const selectOrderInfoError = (state: RootState) =>
  state.order.orderInfoError;
