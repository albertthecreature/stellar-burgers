import { RootState } from '../store';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectIngredientCounters = (state: RootState) => {
  const { bun, ingredients } = state.burgerConstructor;
  const counters: Record<string, number> = {};

  ingredients.forEach((ingredient) => {
    counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
  });

  if (bun) {
    counters[bun._id] = 2;
  }

  return counters;
};

export const selectConstructorPrice = (state: RootState) => {
  const { bun, ingredients } = state.burgerConstructor;

  return (
    (bun ? bun.price * 2 : 0) +
    ingredients.reduce((sum, item) => sum + item.price, 0)
  );
};
