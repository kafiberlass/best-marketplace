// HOC защиты маршрутов: страницы корзины и заказов доступны только авторизованным,
// страницы входа и регистрации - только гостям
import type { ComponentType } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/selectors';

// В state при редиректе на вход запоминаем, откуда пришёл пользователь
export interface FromState {
  from?: { pathname: string };
}

// Дженерик P - пропсы оборачиваемого компонента, они пробрасываются без изменений
export function withAuth<P extends object>(Component: ComponentType<P>) {
  function Protected(props: P) {
    const user = useAppSelector(selectUser);
    const location = useLocation();
    if (!user) {
      return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
    }
    return <Component {...props} />;
  }
  Protected.displayName = `withAuth(${Component.displayName || Component.name})`;
  return Protected;
}

export function withGuest<P extends object>(Component: ComponentType<P>) {
  function GuestOnly(props: P) {
    const user = useAppSelector(selectUser);
    const location = useLocation<FromState | undefined>();
    if (user) {
      return <Redirect to={location.state?.from || '/'} />;
    }
    return <Component {...props} />;
  }
  GuestOnly.displayName = `withGuest(${Component.displayName || Component.name})`;
  return GuestOnly;
}
