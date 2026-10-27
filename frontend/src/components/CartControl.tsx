import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useHistory, useLocation } from 'react-router-dom';
import { addToCart } from '../store/actions';
import { selectCartQuantity, selectUser } from '../store/selectors';
import QuantityControl from './QuantityControl';
import { Button } from './ui';
import type { Product } from '../types';

// Кнопка "В корзину" или счётчик, если товар уже в корзине.
// Неавторизованного пользователя при попытке добавить товар отправляем на страницу входа
interface CartControlProps {
  product: Product;
  size?: 'normal' | 'large';
}

function CartControl({ product, size = 'normal' }: CartControlProps) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const quantity = useAppSelector(selectCartQuantity(product.id));

  const handleAdd = () => {
    if (!user) {
      history.push('/login', { from: location });
      return;
    }
    dispatch(addToCart(product.id));
  };

  if (quantity > 0) {
    return <QuantityControl productId={product.id} quantity={quantity} title={product.title} />;
  }
  return (
    <Button $variant="outline" onClick={handleAdd} style={size === 'large' ? { padding: '12px 32px', fontSize: 18 } : undefined}>
      В корзину
    </Button>
  );
}

export default CartControl;
