import { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Page from '../components/Page';
import SortControl, { type SortOption } from '../components/SortControl';
import { ErrorMessage, Muted, PageTitle } from '../components/ui';
import { setOrdersSort } from '../store/actions';
import { selectOrders } from '../store/selectors';
import { imageUrl } from '../api';
import { formatDate, formatPrice } from '../utils';
import type { OrderSortField, OrderStatus } from '../types';

const SORT_OPTIONS: SortOption<OrderSortField>[] = [
  { value: 'date', label: 'Дате' },
  { value: 'price', label: 'Стоимости' },
];

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }
`;

const List = styled.ul`
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Card = styled.li`
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(0, 1.4fr) auto;
  gap: 20px;
  align-items: center;
  padding: 18px 22px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};

  ${({ theme }) => theme.mobile} {
    grid-template-columns: 1fr;
  }
`;

const OrderId = styled.h2`
  margin: 0 0 6px;
  font-size: 20px;
`;

const Info = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Photos = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Thumb = styled(Link)`
  position: relative;
  display: block;
  width: 96px;

  img {
    display: block;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
  }
`;

const Qty = styled.span`
  position: absolute;
  right: -6px;
  bottom: -6px;
  padding: 0 7px;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: #fff;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;

  ${({ theme }) => theme.mobile} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

// Record<OrderStatus, ...> - TypeScript проверит, что цвет задан для каждого статуса
const STATUS_COLORS: Record<OrderStatus, string> = { Доставлен: '#4c9a4c', 'В пути': '#d48a1a', Оформлен: '#3b7fd1' };

const Status = styled.span<{ $status: OrderStatus }>`
  font-weight: 700;
  color: ${({ $status }) => STATUS_COLORS[$status]};
`;

const Cost = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

// "Мои заказы" - доступно только авторизованным, сортировка по дате и стоимости
function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, sort } = useAppSelector(selectOrders);

  // Пустой объект - "загрузить с текущей сортировкой"
  useEffect(() => {
    dispatch(setOrdersSort({}));
  }, [dispatch]);

  return (
    <Page>
      <Header>
        <PageTitle>Мои заказы</PageTitle>
        <SortControl options={SORT_OPTIONS} value={sort.sort} order={sort.order} onChange={(change) => dispatch(setOrdersSort(change))} />
      </Header>

      {status === 'error' && <ErrorMessage>{error}</ErrorMessage>}
      {status === 'loading' && items.length === 0 && <Muted>Загрузка…</Muted>}
      {status === 'ready' && items.length === 0 && (
        <Muted>
          Заказов пока нет. <Link to="/">Перейти к товарам</Link>
        </Muted>
      )}

      <List>
        {items.map((order) => (
          <Card key={order.id}>
            <div>
              <OrderId>Заказ №{order.id}</OrderId>
              <Info>Адрес доставки: {order.address}</Info>
              <Info>Дата доставки: {formatDate(order.deliveryDate)}</Info>
              <Info>Дата заказа: {formatDate(order.createdAt)}</Info>
            </div>
            <Photos>
              {order.items.map((item) => (
                <li key={item.productId}>
                  <Thumb to={`/products/${item.productId}`} title={`${item.title} × ${item.quantity}`}>
                    <img src={imageUrl(item.photo)} alt={item.title} />
                    {item.quantity > 1 && <Qty>×{item.quantity}</Qty>}
                  </Thumb>
                </li>
              ))}
            </Photos>
            <Right>
              <Status $status={order.status}>{order.status}</Status>
              <Cost>{formatPrice(order.total)}</Cost>
            </Right>
          </Card>
        ))}
      </List>
    </Page>
  );
}

export default MyOrdersPage;
