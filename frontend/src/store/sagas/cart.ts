import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { api, getErrorMessage } from '../../api';
import type { Cart } from '../../types';
import {
  CART_FETCH,
  CART_ADD,
  CART_SET_QUANTITY,
  cartSuccess,
  cartFailure,
  type addToCart,
  type setCartQuantity,
} from '../actions';

// Сервер в ответ всегда присылает корзину целиком - просто кладём её в стор
function* requestCart(load: () => Promise<Cart>): SagaIterator {
  try {
    const cart: Cart = yield call(load);
    yield put(cartSuccess(cart));
  } catch (error) {
    yield put(cartFailure(getErrorMessage(error)));
  }
}

function* loadCart(): SagaIterator {
  yield call(requestCart, api.getCart);
}

function* add(action: ReturnType<typeof addToCart>): SagaIterator {
  yield call(requestCart, () => api.addToCart(action.payload.productId));
}

function* changeQuantity(action: ReturnType<typeof setCartQuantity>): SagaIterator {
  const { productId, quantity } = action.payload;
  yield call(requestCart, () => api.setCartQuantity(productId, quantity));
}

export default function* cartSaga(): SagaIterator {
  yield takeLatest(CART_FETCH, loadCart);
  yield takeEvery(CART_ADD, add);
  yield takeEvery(CART_SET_QUANTITY, changeQuantity);
}
