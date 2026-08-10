import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectOrderInfo,
  selectOrderInfoError,
  selectOrderInfoLoading
} from '@selectors';
import { clearOrderInfo, fetchOrderByNumber } from '@slices';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(selectOrderInfo);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  /* Готовим данные для отображения */
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectOrderInfoLoading);
  const error = useSelector(selectOrderInfoError);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }

    return () => {
      dispatch(clearOrderInfo());
    };
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium pt-10 pl-10'>{error}</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
