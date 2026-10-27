import styled from 'styled-components';
import { ArrowIcon } from './icons';
import { Select } from './ui';
import type { SortOrder } from '../types';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DirectionButton = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

// Выпадающий список "Сортировать по" и стрелка направления (как на макете)
export interface SortOption<F extends string> {
  value: F;
  label: string;
}

// Дженерик F - допустимые поля сортировки ('title' | 'price' для товаров, 'date' | 'price' для заказов)
interface SortControlProps<F extends string> {
  options: SortOption<F>[];
  value: F;
  order: SortOrder;
  onChange: (change: { sort?: F; order?: SortOrder }) => void;
}

function SortControl<F extends string>({ options, value, order, onChange }: SortControlProps<F>) {
  const isAsc = order === 'asc';
  return (
    <Wrapper>
      <Select aria-label="Сортировать по" value={value} onChange={(event) => onChange({ sort: event.target.value as F })}>
        {options.map(({ value: optionValue, label }) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </Select>
      <DirectionButton
        type="button"
        disabled={!value}
        title={isAsc ? 'По возрастанию' : 'По убыванию'}
        aria-label={isAsc ? 'Сейчас по возрастанию, переключить на убывание' : 'Сейчас по убыванию, переключить на возрастание'}
        onClick={() => onChange({ order: isAsc ? 'desc' : 'asc' })}
      >
        {/* Стрелка вниз - по убыванию (от большего к меньшему), вверх - по возрастанию */}
        <ArrowIcon up={isAsc} />
      </DirectionButton>
    </Wrapper>
  );
}

export default SortControl;
