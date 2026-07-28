import { FC } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorItems,
  selectConstructorPrice,
  selectIsAuthenticated,
  selectOrderModalData,
  selectOrderRequest
} from '@selectors';
import { createOrder, closeOrderModal } from '@slices';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };

  const price = useSelector(selectConstructorPrice);

  if (!isAuthenticated) {
    navigate('/login', { state: { from: location } });
    return;
  }

  dispatch(createOrder());

  const handleCloseOrderModal = () => dispatch(closeOrderModal());

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
      price={price}
      orderRequest={orderRequest}
    />
  );
};
