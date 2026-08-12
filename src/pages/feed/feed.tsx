import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useRef, useState } from 'react';
import {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders
} from '@selectors';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeeds, updateFeedData, getFeedWsUrl } from '@slices';

export const Feed: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const dispatch = useDispatch();

  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    dispatch(fetchFeeds());

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(getFeedWsUrl());
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Feed WebSocket connected');
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.success && Array.isArray(data.orders)) {
              dispatch(
                updateFeedData({
                  orders: data.orders,
                  total: data.total ?? 0,
                  totalToday: data.totalToday ?? 0
                })
              );
            }
          } catch (parseError) {
            console.error('Failed to parse WebSocket message:', parseError);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
        };

        ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          setWsConnected(false);

          if (!event.wasClean) {
            console.log('Attempting to reconnect in 3 seconds...');
            setTimeout(connectWebSocket, 3000);
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket is connected, waiting for updates...');
    } else {
      dispatch(fetchFeeds());
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return <p className='text text_type_main-medium pt-4'>{error}</p>;
  }

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
      {!wsConnected && orders.length > 0 && (
        <p className='text text_type_main-small text_color_inactive pt-4'>
          ⚠️ Обновление в реальном времени недоступно
        </p>
      )}
    </>
  );
};
