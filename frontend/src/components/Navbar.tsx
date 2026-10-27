import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/actions';
import { selectCart, selectUser } from '../store/selectors';
import { OrdersIcon, CartIcon, LogoutIcon } from './icons';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(1200px, 100% - 32px);
  margin: 0 auto;
  padding: 12px 0;
`;

const Logo = styled(Link)`
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 700;
  letter-spacing: -0.5px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
`;

const Icons = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IconLink = styled(NavLink)`
  position: relative;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
  min-width: 20px;
  padding: 0 5px;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  color: #fff;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
`;

// Классический навбар: название - ссылка на главную, иконки - тоже ссылки.
// Неавторизованный пользователь видит только название
function Navbar() {
  const user = useAppSelector(selectUser);
  const { count } = useAppSelector(selectCart);
  const dispatch = useAppDispatch();

  return (
    <Bar>
      <Inner>
        <Logo to="/">BestMarketPlace</Logo>
        {user && (
          <Icons aria-label="Личный кабинет">
            <IconLink to="/my-orders" title="Мои заказы" aria-label="Мои заказы">
              <OrdersIcon />
            </IconLink>
            <IconLink to="/cart" title="Корзина" aria-label={`Корзина, товаров: ${count}`}>
              <CartIcon />
              {count > 0 && <Badge>{count}</Badge>}
            </IconLink>
            <IconLink to="/login" title="Выйти" aria-label="Выйти" onClick={() => dispatch(logout())}>
              <LogoutIcon />
            </IconLink>
          </Icons>
        )}
      </Inner>
    </Bar>
  );
}

export default Navbar;
