import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserName } from '@selectors';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserName);

  return <AppHeaderUI userName={userName} />;
};
