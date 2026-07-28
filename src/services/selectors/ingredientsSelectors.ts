import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = (state: RootState) =>
  state.ingredients.items.filter((i) => i.type === 'bun');

export const selectMains = (state: RootState) =>
  state.ingredients.items.filter((i) => i.type === 'main');

export const selectSauces = (state: RootState) =>
  state.ingredients.items.filter((i) => i.type === 'sauce');

export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((i) => i._id === id);
