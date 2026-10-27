import type { Cart, LoadStatus } from '../../types';
import { CART_FETCH, CART_SUCCESS, CART_FAILURE, LOGOUT, type AppAction } from '../actions';

export interface CartState extends Cart {
  status: LoadStatus;
  error: string | null;
}

const initialState: CartState = { items: [], count: 0, total: 0, status: 'idle', error: null };

export default function cart(state: CartState = initialState, action: AppAction): CartState {
  switch (action.type) {
    case CART_FETCH:
      return { ...state, status: state.status === 'ready' ? 'ready' : 'loading', error: null };
    case CART_SUCCESS:
      return { ...action.payload, status: 'ready', error: null };
    case CART_FAILURE:
      return { ...state, error: action.error, status: state.status === 'loading' ? 'error' : state.status };
    // После выхода корзину в памяти очищаем - на сервере она сохраняется до следующего входа
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
