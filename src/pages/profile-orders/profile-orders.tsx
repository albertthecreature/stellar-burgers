import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchProfileOrders,
  getProfileOrdersWsUrl,
  updateProfileOrders
} from '@slices';
import {
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading
} from '@selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectProfileOrders);

  const dispatch = useDispatch();
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(fetchProfileOrders);

    const ws = new WebSocket(getProfileOrdersWsUrl());
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.success) dispatch(updateProfileOrders(data.orders));
    };

    return () => ws.close();
  }, [dispatch]);

  if (isLoading && !orders.length) return <Preloader />;

  if (error && !orders.length) {
    return <p className='text text_type_main-medium pt-4'>{error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
