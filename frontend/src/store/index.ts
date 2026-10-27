import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware, { type SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import auth from './reducers/auth';
import products from './reducers/products';
import cart from './reducers/cart';
import orders from './reducers/orders';
import authSaga from './sagas/auth';
import productsSaga from './sagas/products';
import cartSaga from './sagas/cart';
import ordersSaga from './sagas/orders';

const rootReducer = combineReducers({ auth, products, cart, orders });

// Тип всего состояния выводится из reducer'ов - не нужно описывать его вручную
export type RootState = ReturnType<typeof rootReducer>;

function* rootSaga(): SagaIterator {
  // fork запускает саги параллельно и не блокирует друг друга
  yield all([fork(authSaga), fork(productsSaga), fork(cartSaga), fork(ordersSaga)]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, undefined, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;

export default store;
