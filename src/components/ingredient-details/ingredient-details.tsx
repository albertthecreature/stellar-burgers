import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredientById } from '@selectors';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id = '' } = useParams<{ id: string }>();
  const ingredientData = useSelector(selectIngredientById(id));

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
