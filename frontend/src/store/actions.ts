import type { Cart, OrdersSort, Product, ProductDetails, ProductsQuery, User, Credentials, SignupData, NewOrder, Order } from '../types';

// Асинхронную работу (запросы к API) выполняют саги: компонент диспатчит обычный объект *_REQUEST,
// сага делает запрос и диспатчит *_SUCCESS или *_FAILURE

// Обратная связь для форм: сага сообщает результат запроса через resolve/reject
export interface FormMeta<T> {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

// ---------- Авторизация ----------
export const AUTH_RESTORE = 'AUTH_RESTORE';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const restoreSession = () => ({ type: AUTH_RESTORE } as const);
export const loginRequest = (payload: Credentials, meta: FormMeta<User>) => ({ type: LOGIN_REQUEST, payload, meta } as const);
export const signupRequest = (payload: SignupData, meta: FormMeta<User>) => ({ type: SIGNUP_REQUEST, payload, meta } as const);
export const authSuccess = (payload: User) => ({ type: AUTH_SUCCESS, payload } as const);
export const logout = () => ({ type: LOGOUT } as const);

// ---------- Товары ----------
export const PRODUCTS_SET_QUERY = 'PRODUCTS_SET_QUERY';
export const PRODUCTS_FETCH = 'PRODUCTS_FETCH';
export const PRODUCTS_SUCCESS = 'PRODUCTS_SUCCESS';
export const PRODUCTS_FAILURE = 'PRODUCTS_FAILURE';
export const PRODUCT_FETCH = 'PRODUCT_FETCH';
export const PRODUCT_SUCCESS = 'PRODUCT_SUCCESS';
export const PRODUCT_FAILURE = 'PRODUCT_FAILURE';

export const setProductsQuery = (payload: Partial<ProductsQuery>) => ({ type: PRODUCTS_SET_QUERY, payload } as const);
export const fetchProducts = () => ({ type: PRODUCTS_FETCH } as const);
export const productsSuccess = (payload: Product[]) => ({ type: PRODUCTS_SUCCESS, payload } as const);
export const productsFailure = (error: string) => ({ type: PRODUCTS_FAILURE, error } as const);
export const fetchProduct = (payload: string) => ({ type: PRODUCT_FETCH, payload } as const);
export const productSuccess = (payload: ProductDetails) => ({ type: PRODUCT_SUCCESS, payload } as const);
export const productFailure = (error: string) => ({ type: PRODUCT_FAILURE, error } as const);

// ---------- Корзина ----------
export const CART_FETCH = 'CART_FETCH';
export const CART_ADD = 'CART_ADD';
export const CART_SET_QUANTITY = 'CART_SET_QUANTITY';
export const CART_SUCCESS = 'CART_SUCCESS';
export const CART_FAILURE = 'CART_FAILURE';

export const fetchCart = () => ({ type: CART_FETCH } as const);
export const addToCart = (productId: number) => ({ type: CART_ADD, payload: { productId } } as const);
export const setCartQuantity = (productId: number, quantity: number) =>
  ({ type: CART_SET_QUANTITY, payload: { productId, quantity } } as const);
export const cartSuccess = (payload: Cart) => ({ type: CART_SUCCESS, payload } as const);
export const cartFailure = (error: string) => ({ type: CART_FAILURE, error } as const);

// ---------- Заказы ----------
export const ORDERS_SET_SORT = 'ORDERS_SET_SORT';
export const ORDERS_SUCCESS = 'ORDERS_SUCCESS';
export const ORDERS_FAILURE = 'ORDERS_FAILURE';
export const ORDER_CREATE = 'ORDER_CREATE';

export const setOrdersSort = (payload: Partial<OrdersSort>) => ({ type: ORDERS_SET_SORT, payload } as const);
export const ordersSuccess = (payload: Order[]) => ({ type: ORDERS_SUCCESS, payload } as const);
export const ordersFailure = (error: string) => ({ type: ORDERS_FAILURE, error } as const);
export const createOrder = (payload: NewOrder, meta: FormMeta<Order>) => ({ type: ORDER_CREATE, payload, meta } as const);

// Объединение всех действий приложения - reducer'ы проверяют type и TypeScript сам сужает тип
export type AppAction = ReturnType<
  | typeof restoreSession
  | typeof loginRequest
  | typeof signupRequest
  | typeof authSuccess
  | typeof logout
  | typeof setProductsQuery
  | typeof fetchProducts
  | typeof productsSuccess
  | typeof productsFailure
  | typeof fetchProduct
  | typeof productSuccess
  | typeof productFailure
  | typeof fetchCart
  | typeof addToCart
  | typeof setCartQuantity
  | typeof cartSuccess
  | typeof cartFailure
  | typeof setOrdersSort
  | typeof ordersSuccess
  | typeof ordersFailure
  | typeof createOrder
>;
