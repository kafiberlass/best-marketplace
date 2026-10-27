import type { LoadStatus, Order, OrdersSort } from '../../types';
import { ORDERS_SET_SORT, ORDERS_SUCCESS, ORDERS_FAILURE, LOGOUT, type AppAction } from '../actions';

export interface OrdersState {
  items: Order[];
  status: LoadStatus;
  error: string | null;
  sort: OrdersSort;
}

const initialState: OrdersState = { items: [], status: 'idle', error: null, sort: { sort: 'date', order: 'desc' } };

export default function orders(state: OrdersState = initialState, action: AppAction): OrdersState {
  switch (action.type) {
    case ORDERS_SET_SORT:
      return { ...state, status: 'loading', error: null, sort: { ...state.sort, ...action.payload } };
    case ORDERS_SUCCESS:
      return { ...state, status: 'ready', items: action.payload };
    case ORDERS_FAILURE:
      return { ...state, status: 'error', error: action.error };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
