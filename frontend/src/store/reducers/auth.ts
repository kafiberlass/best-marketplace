import type { User } from '../../types';
import { AUTH_RESTORE, AUTH_SUCCESS, LOGOUT, type AppAction } from '../actions';

export interface AuthState {
  user: User | null;
  // 'checking' - пока проверяем сохранённый токен, 'ready' - всё известно
  status: 'checking' | 'ready';
}

const initialState: AuthState = { user: null, status: 'checking' };

export default function auth(state: AuthState = initialState, action: AppAction): AuthState {
  switch (action.type) {
    case AUTH_RESTORE:
      return { ...state, status: 'checking' };
    case AUTH_SUCCESS:
      return { user: action.payload, status: 'ready' };
    case LOGOUT:
      return { user: null, status: 'ready' };
    default:
      return state;
  }
}
