import type { LoadStatus, Product, ProductDetails, ProductsQuery } from '../../types';
import {
  PRODUCTS_SET_QUERY,
  PRODUCTS_FETCH,
  PRODUCTS_SUCCESS,
  PRODUCTS_FAILURE,
  PRODUCT_FETCH,
  PRODUCT_SUCCESS,
  PRODUCT_FAILURE,
  type AppAction,
} from '../actions';

export interface CurrentProductState {
  item: ProductDetails | null;
  id: string | null;
  status: LoadStatus;
  error: string | null;
}

export interface ProductsState {
  items: Product[];
  status: LoadStatus;
  error: string | null;
  query: ProductsQuery;
  current: CurrentProductState;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  query: { search: '', sort: '', order: 'asc' },
  current: { item: null, id: null, status: 'idle', error: null },
};

export default function products(state: ProductsState = initialState, action: AppAction): ProductsState {
  switch (action.type) {
    case PRODUCTS_SET_QUERY:
      return { ...state, query: { ...state.query, ...action.payload } };
    case PRODUCTS_FETCH:
      return { ...state, status: 'loading', error: null };
    case PRODUCTS_SUCCESS:
      return { ...state, status: 'ready', items: action.payload };
    case PRODUCTS_FAILURE:
      return { ...state, status: 'error', error: action.error };
    case PRODUCT_FETCH:
      return { ...state, current: { item: null, id: action.payload, status: 'loading', error: null } };
    case PRODUCT_SUCCESS:
      return { ...state, current: { item: action.payload, id: String(action.payload.id), status: 'ready', error: null } };
    case PRODUCT_FAILURE:
      return { ...state, current: { ...state.current, status: 'error', error: action.error } };
    default:
      return state;
  }
}
