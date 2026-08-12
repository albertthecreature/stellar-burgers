import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  TConstructorState
} from '../constructorSlice';
import { createOrder } from '../orderSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 125,
  image: 'bun.png',
  image_large: 'bun_large.png',
  image_mobile: 'bun_mobile.png'
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_large: 'main_large.png',
  image_mobile: 'main_mobile.png'
};

const mockConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id
});

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

describe('constructorReducer', () => {
  test('Возращает начальное состояние при неизвестном экшене и undefined state', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('Обрабатывает addIngredient для булки', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));

    expect(state.bun).toEqual({ ...mockBun, id: 'test-uuid' });
    expect(state.ingredients).toEqual([]);
  });

  test('Обрабатывает addIngredient для начинки', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{ ...mockMain, id: 'test-uuid' }]);
  });

  test('Обрабатывает removeIngredient', () => {
    const prevState: TConstructorState = {
      bun: null,
      ingredients: [
        mockConstructorIngredient(mockMain, 'id-1'),
        mockConstructorIngredient(mockMain, 'id-2')
      ]
    };

    const state = constructorReducer(prevState, removeIngredient('id-1'));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('id-2');
  });

  test('Обрабатывает moveIngredient', () => {
    const prevState: TConstructorState = {
      bun: null,
      ingredients: [
        mockConstructorIngredient({ ...mockMain, name: 'Первый' }, 'id-1'),
        mockConstructorIngredient({ ...mockMain, name: 'Второй' }, 'id-2'),
        mockConstructorIngredient({ ...mockMain, name: 'Третий' }, 'id-3')
      ]
    };

    const state = constructorReducer(
      prevState,
      moveIngredient({ dragIndex: 0, hoverIndex: 2 })
    );

    expect(state.ingredients.map((item) => item.name)).toEqual([
      'Второй',
      'Третий',
      'Первый'
    ]);
  });

  test('Обрабатывает clearConstructor', () => {
    const prevState: TConstructorState = {
      bun: mockConstructorIngredient(mockBun, 'bun-id'),
      ingredients: [mockConstructorIngredient(mockMain, 'main-id')]
    };

    const state = constructorReducer(prevState, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('Обрабатывает createOrder.fulfilled', () => {
    const prevState: TConstructorState = {
      bun: mockConstructorIngredient(mockBun, 'bun-id'),
      ingredients: [mockConstructorIngredient(mockMain, 'main-id')]
    };

    const state = constructorReducer(
      prevState,
      createOrder.fulfilled(
        {
          order: {
            _id: 'order-1',
            status: 'done',
            name: 'Space бургер',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            number: 12345,
            price: 979,
            owner: {
              name: 'Test User',
              email: 'test@test.ru',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            }
          },
          ingredients: ['bun-1', 'main-1', 'bun-1']
        },
        '',
        undefined
      )
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
