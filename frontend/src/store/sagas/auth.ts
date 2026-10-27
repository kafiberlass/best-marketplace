import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { api, tokenStorage } from '../../api';
import type { AuthResponse, User } from '../../types';
import {
  AUTH_RESTORE,
  LOGIN_REQUEST,
  SIGNUP_REQUEST,
  LOGOUT,
  authSuccess,
  logout,
  fetchCart,
  type loginRequest,
  type signupRequest,
} from '../actions';

type SignInAction = ReturnType<typeof loginRequest> | ReturnType<typeof signupRequest>;

// После перезагрузки страницы восстанавливаем пользователя по сохранённому токену
function* restoreSession(): SagaIterator {
  if (!tokenStorage.get()) {
    yield put(logout());
    return;
  }
  try {
    const { user }: { user: User } = yield call(api.me);
    yield put(authSuccess(user));
    yield put(fetchCart());
  } catch {
    yield put(logout());
  }
}

// Общая сага для входа и регистрации. Результат возвращаем форме через meta.resolve/reject
function* signIn(action: SignInAction): SagaIterator {
  const { resolve, reject } = action.meta;
  try {
    const { token, user }: AuthResponse =
      action.type === LOGIN_REQUEST ? yield call(api.login, action.payload) : yield call(api.signup, action.payload);
    tokenStorage.set(token);
    yield put(authSuccess(user));
    // Корзина хранится на сервере - после входа подгружаем её
    yield put(fetchCart());
    resolve(user);
  } catch (error) {
    reject(error);
  }
}

function* clearToken(): SagaIterator {
  yield call([tokenStorage, tokenStorage.remove]);
}

export default function* authSaga(): SagaIterator {
  yield takeLatest(AUTH_RESTORE, restoreSession);
  yield takeLatest([LOGIN_REQUEST, SIGNUP_REQUEST], signIn);
  yield takeLatest(LOGOUT, clearToken);
}
