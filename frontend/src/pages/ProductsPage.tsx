import { memo, useEffect, useState, type ChangeEvent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Page from '../components/Page';
import CartControl from '../components/CartControl';
import SortControl, { type SortOption } from '../components/SortControl';
import { SearchIcon } from '../components/icons';
import { ErrorMessage, Input, Muted } from '../components/ui';
import { fetchProducts, setProductsQuery } from '../store/actions';
import { selectProducts } from '../store/selectors';
import { imageUrl } from '../api';
import { formatPrice } from '../utils';
import type { Product, ProductSortField } from '../types';

const SORT_OPTIONS: SortOption<ProductSortField>[] = [
  { value: '', label: 'Сортировать по' },
  { value: 'title', label: 'Названию' },
  { value: 'price', label: 'Цене' },
];

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchBox = styled.label`
  position: relative;
  flex: 0 1 320px;

  svg {
    position: absolute;
    top: 50%;
    right: 12px;
    color: ${({ theme }) => theme.colors.muted};
    transform: translateY(-50%);
  }

  input {
    padding-right: 40px;
  }
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 22px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Card = styled.li`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow};
    transform: translateY(-2px);
  }
`;

const PhotoLink = styled(Link)`
  display: block;
`;

const Photo = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px 16px;
`;

const Title = styled(Link)`
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Price = styled.p`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Actions = styled.div`
  margin-top: auto;
`;

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <PhotoLink to={`/products/${product.id}`} tabIndex={-1} aria-hidden="true">
        <Photo src={imageUrl(product.photo)} alt="" loading="lazy" />
      </PhotoLink>
      <Body>
        <Title to={`/products/${product.id}`}>{product.title}</Title>
        <Price>{formatPrice(product.price)}</Price>
        <Actions>
          <CartControl product={product} />
        </Actions>
      </Body>
    </Card>
  );
});

// Главная страница: все товары, поиск по названию, сортировка по названию/цене
function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, query } = useAppSelector(selectProducts);
  // Текст поиска показываем сразу, а запрос отправит сага после паузы в вводе
  const [search, setSearch] = useState(query.search);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    dispatch(setProductsQuery({ search: event.target.value }));
  };

  return (
    <Page>
      <Toolbar>
        <SearchBox>
          <Input type="search" placeholder="Поиск товаров" aria-label="Поиск по названию" value={search} onChange={handleSearch} />
          <SearchIcon />
        </SearchBox>
        <SortControl
          options={SORT_OPTIONS}
          value={query.sort}
          order={query.order}
          onChange={(change) => dispatch(setProductsQuery(change))}
        />
      </Toolbar>

      {status === 'error' && <ErrorMessage>{error}</ErrorMessage>}
      {status === 'loading' && items.length === 0 && <Muted>Загрузка…</Muted>}
      {status === 'ready' && items.length === 0 && <Muted>Ничего не нашлось. Попробуйте изменить запрос</Muted>}

      <Grid>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
    </Page>
  );
}

export default ProductsPage;
