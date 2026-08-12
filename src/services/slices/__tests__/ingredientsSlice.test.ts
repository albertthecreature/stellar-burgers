import ingredientsReducer, {
  fetchIngredients,
  TIngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 125,
  image: 'image.png',
  image_large: 'image_large.png',
  image_mobile: 'image_mobile.png'
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

describe('ingredientsReducer', () => {
  test('Возвращает начальное состояние при неизвестном экшене и undefined state', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('Обрабатывает fetchIngredients.pending', () => {
    const prevState: TIngredientsState = {
      items: [mockIngredient],
      isLoading: false,
      error: 'Предыдущая ошибка'
    };

    const state = ingredientsReducer(
      prevState,
      fetchIngredients.pending('', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.items).toEqual([mockIngredient]);
  });

  test('Обрабатывает fetchIngredients.fulfilled', () => {
    const prevState: TIngredientsState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      prevState,
      fetchIngredients.fulfilled([mockIngredient], '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual([mockIngredient]);
    expect(state.error).toBeNull();
  });

  test('Обрабатывает fetchIngredients.rejected', () => {
    const prevState: TIngredientsState = {
      items: [mockIngredient],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      prevState,
      fetchIngredients.rejected(new Error('Ошибка сети'), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
    expect(state.items).toEqual([mockIngredient]);
  });

  test('Использует сообщение по умолчанию при fetchIngredients.rejected без error.message', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(new Error(''), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
