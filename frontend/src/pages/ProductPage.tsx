import { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Page from '../components/Page';
import CartControl from '../components/CartControl';
import { ErrorMessage, Muted, Panel } from '../components/ui';
import { fetchProduct } from '../store/actions';
import { selectCurrentProduct } from '../store/selectors';
import { imageUrl } from '../api';
import { formatPrice } from '../utils';

const Title = styled.h1`
  margin: 0 0 20px;
  font-size: clamp(26px, 4vw, 36px);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: 32px;

  ${({ theme }) => theme.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Photo = styled.img`
  display: block;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Description = styled(Panel)`
  font-size: 18px;
  line-height: 1.6;
`;

const Vendor = styled(Panel)`
  margin-top: 24px;

  h2 {
    margin: 0 0 6px;
    font-size: 18px;
  }
`;

const Buy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  margin-top: 24px;
`;

const Price = styled.p`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

// Страница товара - доступна и неавторизованным пользователям
function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { item: product, id: loadedId, status, error } = useAppSelector(selectCurrentProduct);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  let content: JSX.Element;
  if (status === 'error') {
    content = (
      <>
        <ErrorMessage>{error}</ErrorMessage>
        <Link to="/">← К каталогу</Link>
      </>
    );
  } else if (!product || loadedId !== id) {
    content = <Muted>Загрузка…</Muted>;
  } else {
    content = (
      <>
        <Title>{product.title}</Title>
        <Layout>
          <div>
            <Photo src={imageUrl(product.photo)} alt={product.title} />
            <Vendor>
              <h2>Продавец: {product.vendorName}</h2>
              <Muted>{product.vendorInfo}</Muted>
            </Vendor>
          </div>
          <div>
            <Description>{product.description}</Description>
            <Buy>
              <Price>{formatPrice(product.price)}</Price>
              <CartControl product={product} size="large" />
            </Buy>
          </div>
        </Layout>
      </>
    );
  }

  return <Page>{content}</Page>;
}

export default ProductPage;
