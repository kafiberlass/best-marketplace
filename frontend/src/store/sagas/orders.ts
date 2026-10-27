import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { api, getErrorMessage } from '../../api';
import type { Order, OrdersSort } from '../../types';
import type { RootState } from '../index';
import { ORDERS_SET_SORT, ORDER_CREATE, ordersSuccess, ordersFailure, cartSuccess, type createOrder } from '../actions';

const selectSort = (state: RootState): OrdersSort => state.orders.sort;

function* loadOrders(): SagaIterator {
  const sort: OrdersSort = yield select(selectSort);
  try {
    const orders: Order[] = yield call(api.getOrders, sort);
    yield put(ordersSuccess(orders));
  } catch (error) {
    yield put(ordersFailure(getErrorMessage(error)));
  }
}

function* placeOrder(action: ReturnType<typeof createOrder>): SagaIterator {
  const { resolve, reject } = action.meta;
  try {
    const order: Order = yield call(api.createOrder, action.payload);
    // Сервер очищает корзину после оформления заказа - очищаем и в сторе
    yield put(cartSuccess({ items: [], count: 0, total: 0 }));
    resolve(order);
  } catch (error) {
    reject(error);
  }
}

export default function* ordersSaga(): SagaIterator {
  yield takeLatest(ORDERS_SET_SORT, loadOrders);
  yield takeLatest(ORDER_CREATE, placeOrder);
}
