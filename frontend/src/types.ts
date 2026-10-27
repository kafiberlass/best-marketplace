// Типы данных, которые приходят с backend

export interface User {
  id: number;
  login: string;
}

export interface Product {
  id: number;
  title: string;
  shortDescription: string;
  price: number;
  photo: string;
}

// Подробная информация о товаре (страница товара)
export interface ProductDetails extends Product {
  description: string;
  vendorName: string;
  vendorInfo: string | null;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  count: number;
  total: number;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  title: string;
  photo: string;
}

export type OrderStatus = 'Оформлен' | 'В пути' | 'Доставлен';

export interface Order {
  id: number;
  address: string;
  createdAt: string;
  deliveryDate: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type SortOrder = 'asc' | 'desc';
export type ProductSortField = '' | 'title' | 'price';
export type OrderSortField = 'date' | 'price';

export interface ProductsQuery {
  search: string;
  sort: ProductSortField;
  order: SortOrder;
}

export interface OrdersSort {
  sort: OrderSortField;
  order: SortOrder;
}

export interface Credentials {
  login: string;
  password: string;
}

export interface SignupData extends Credentials {
  repeatPassword: string;
}

export interface NewOrder {
  address: string;
}

// Статус загрузки данных
export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';
