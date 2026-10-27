import type {
  AuthResponse,
  Cart,
  Credentials,
  NewOrder,
  Order,
  OrdersSort,
  Product,
  ProductDetails,
  ProductsQuery,
  SignupData,
  User,
} from './types';

// Запросы к нашему backend. Адрес можно поменять переменной REACT_APP_API_URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'bestMarketplace:token';

// Токен храним в localStorage - так пользователь остаётся в системе после перезагрузки
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // без localStorage вход просто не переживёт перезагрузку
    }
  },
  remove(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ничего страшного
    }
  },
};

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

interface ErrorBody {
  error?: string;
}

// Дженерик: вызывающий код указывает, данные какого типа вернёт запрос
async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Сервер недоступен. Проверьте, что backend запущен');
  }

  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, (data as ErrorBody).error || 'Что-то пошло не так');
  }
  return data as T;
}

export const imageUrl = (path: string): string => `${API_URL}${path}`;

const query = (params: Record<string, string>): string => {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
  const text = search.toString();
  return text ? `?${text}` : '';
};

export const api = {
  login: (credentials: Credentials) => request<AuthResponse>('/login', { method: 'POST', body: credentials }),
  signup: (data: SignupData) => request<AuthResponse>('/signup', { method: 'POST', body: data }),
  me: () => request<{ user: User }>('/me'),
  getProducts: ({ search, sort, order }: ProductsQuery) => request<Product[]>(`/products${query({ search, sort, order })}`),
  getProduct: (id: string) => request<ProductDetails>(`/products/${id}`),
  getCart: () => request<Cart>('/cart'),
  addToCart: (productId: number) => request<Cart>('/cart', { method: 'POST', body: { productId } }),
  setCartQuantity: (productId: number, quantity: number) =>
    request<Cart>('/cart', { method: 'PUT', body: { productId, quantity } }),
  getOrders: ({ sort, order }: OrdersSort) => request<Order[]>(`/my-orders${query({ sort, order })}`),
  createOrder: (data: NewOrder) => request<Order>('/my-orders', { method: 'POST', body: data }),
};

// Текст ошибки из чего угодно, что могло быть выброшено
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Что-то пошло не так';
