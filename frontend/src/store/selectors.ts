import type { RootState } from './index';

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectProducts = (state: RootState) => state.products;
export const selectCurrentProduct = (state: RootState) => state.products.current;
export const selectCart = (state: RootState) => state.cart;
export const selectOrders = (state: RootState) => state.orders;
// Сколько штук товара в корзине (0 - нет в корзине)
export const selectCartQuantity =
  (productId: number) =>
  (state: RootState): number =>
    state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0;
