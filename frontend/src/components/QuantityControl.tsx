import styled from 'styled-components';
import { useAppDispatch } from '../store/hooks';
import { setCartQuantity } from '../store/actions';

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
`;

const Step = styled.button`
  width: 38px;
  height: 38px;
  font: inherit;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

const Count = styled.span`
  min-width: 28px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

// Счётчик "-N+" как на макете. При уменьшении до нуля товар удаляется из корзины
interface QuantityControlProps {
  productId: number;
  quantity: number;
  title: string;
}

function QuantityControl({ productId, quantity, title }: QuantityControlProps) {
  const dispatch = useAppDispatch();
  const change = (next: number) => dispatch(setCartQuantity(productId, next));

  return (
    <Wrapper>
      <Step type="button" aria-label={`Убрать одну штуку: ${title}`} onClick={() => change(quantity - 1)}>
        −
      </Step>
      <Count aria-live="polite">{quantity}</Count>
      <Step type="button" aria-label={`Добавить ещё одну: ${title}`} onClick={() => change(quantity + 1)} disabled={quantity >= 99}>
        +
      </Step>
    </Wrapper>
  );
}

export default QuantityControl;
