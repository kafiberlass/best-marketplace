import { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useForm } from 'react-hook-form';
import Page from '../components/Page';
import QuantityControl from '../components/QuantityControl';
import { Button, ErrorMessage, Field, FieldLabel, Input, Muted, PageTitle, Panel } from '../components/ui';
import { createOrder, fetchCart } from '../store/actions';
import { selectCart } from '../store/selectors';
import { imageUrl } from '../api';
import { formatPrice } from '../utils';
import { getErrorMessage } from '../api';
import type { NewOrder, Order } from '../types';

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;

  ${({ theme }) => theme.mobile} {
    grid-template-columns: 1fr;
  }
`;

const List = styled.ul`
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};

  ${({ theme }) => theme.mobile} {
    grid-template-columns: 90px minmax(0, 1fr);
  }
`;

const Photo = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Title = styled(Link)`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  ${({ theme }) => theme.mobile} {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Summary = styled(Panel).attrs({ as: 'form' })`
  position: sticky;
  top: 90px;

  ${({ theme }) => theme.mobile} {
    position: static;
  }
`;

const SummaryRow = styled.p`
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px;
  font-size: 18px;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FieldError = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.danger};
`;

// Форма оформления заказа на react-hook-form: адрес доставки обязателен
interface OrderFormProps {
  count: number;
  total: number;
}

function OrderForm({ count, total }: OrderFormProps) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewOrder>({ defaultValues: { address: '' } });

  const onSubmit = (data: NewOrder) =>
    new Promise<Order>((resolve, reject) => dispatch(createOrder({ address: data.address.trim() }, { resolve, reject })))
      .then(() => history.push('/my-orders'))
      .catch((error: unknown) => setError('root.server', { message: getErrorMessage(error) }));

  return (
    <Summary onSubmit={handleSubmit(onSubmit)} noValidate>
      {errors.root?.server && <ErrorMessage role="alert">{errors.root.server.message}</ErrorMessage>}
      <SummaryRow>
        Товаров: <strong>{count}</strong>
      </SummaryRow>
      <SummaryRow>
        Итого: <strong>{formatPrice(total)}</strong>
      </SummaryRow>

      <Field>
        <FieldLabel>Адрес доставки</FieldLabel>
        <Input
          placeholder="Город, улица, дом, квартира"
          aria-invalid={Boolean(errors.address)}
          {...register('address', {
            required: 'Укажите адрес доставки',
            validate: (value) => value.trim().length >= 5 || 'Адрес слишком короткий',
            maxLength: { value: 200, message: 'Адрес — не длиннее 200 символов' },
          })}
        />
        {errors.address && <FieldError role="alert">{errors.address.message}</FieldError>}
      </Field>

      <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
        {isSubmitting ? 'Оформляем…' : 'Оформить заказ'}
      </Button>
    </Summary>
  );
}

// Корзина - доступна только авторизованным
function CartPage() {
  const dispatch = useAppDispatch();
  const { items, count, total, status, error } = useAppSelector(selectCart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <Page>
      <PageTitle>Корзина</PageTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {status === 'loading' && <Muted>Загрузка…</Muted>}
      {status === 'ready' && items.length === 0 && (
        <Muted>
          В корзине пока пусто. <Link to="/">Перейти к товарам</Link>
        </Muted>
      )}

      {items.length > 0 && (
        <Layout>
          <List>
            {items.map(({ productId, quantity, product }) => (
              <Item key={productId}>
                <Link to={`/products/${productId}`} tabIndex={-1} aria-hidden="true">
                  <Photo src={imageUrl(product.photo)} alt="" />
                </Link>
                <div>
                  <Title to={`/products/${productId}`}>{product.title}</Title>
                  <Muted>{product.shortDescription}</Muted>
                </div>
                <Side>
                  <Price>{formatPrice(product.price)}</Price>
                  <QuantityControl productId={productId} quantity={quantity} title={product.title} />
                </Side>
              </Item>
            ))}
          </List>
          <OrderForm count={count} total={total} />
        </Layout>
      )}
    </Page>
  );
}

export default CartPage;
