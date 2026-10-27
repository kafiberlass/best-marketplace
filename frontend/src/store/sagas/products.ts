import { call, debounce, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { api, getErrorMessage } from '../../api';
import type { Product, ProductDetails, ProductsQuery } from '../../types';
import type { RootState } from '../index';
import {
  PRODUCTS_SET_QUERY,
  PRODUCTS_FETCH,
  PRODUCT_FETCH,
  fetchProducts,
  productsSuccess,
  productsFailure,
  productSuccess,
  productFailure,
  type fetchProduct,
} from '../actions';

const SEARCH_DELAY = 300;

const selectQuery = (state: RootState): ProductsQuery => state.products.query;

function* loadProducts(): SagaIterator {
  const query: ProductsQuery = yield select(selectQuery);
  try {
    const items: Product[] = yield call(api.getProducts, query);
    yield put(productsSuccess(items));
  } catch (error) {
    yield put(productsFailure(getErrorMessage(error)));
  }
}

// Поиск и сортировка: ждём паузу в вводе (debounce) и только потом отправляем запрос
function* queryChanged(): SagaIterator {
  yield put(fetchProducts());
}

function* loadProduct(action: ReturnType<typeof fetchProduct>): SagaIterator {
  try {
    const product: ProductDetails = yield call(api.getProduct, action.payload);
    yield put(productSuccess(product));
  } catch (error) {
    yield put(productFailure(getErrorMessage(error)));
  }
}

export default function* productsSaga(): SagaIterator {
  yield debounce(SEARCH_DELAY, PRODUCTS_SET_QUERY, queryChanged);
  // takeLatest: если пришёл новый запрос, предыдущий незавершённый отменяется
  yield takeLatest(PRODUCTS_FETCH, loadProducts);
  yield takeLatest(PRODUCT_FETCH, loadProduct);
}
