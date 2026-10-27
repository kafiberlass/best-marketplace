import type { SVGProps } from 'react';

// Иконки шапки (как на макете): заказы, корзина, выход, а также поиск и стрелка сортировки
const base: SVGProps<SVGSVGElement> = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const OrdersIcon = () => (
  <svg {...base}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h8" />
  </svg>
);

export const CartIcon = () => (
  <svg {...base}>
    <path d="M3 4h2.5l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.1L20 8H6.3" />
    <circle cx="9.5" cy="19.5" r="1.3" />
    <circle cx="17" cy="19.5" r="1.3" />
  </svg>
);

export const LogoutIcon = () => (
  <svg {...base}>
    <path d="M14 4H6v16h8" />
    <path d="M10 12h10M17 9l3 3-3 3" />
  </svg>
);

export const SearchIcon = () => (
  <svg {...base} width={20} height={20}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const ArrowIcon = ({ up }: { up: boolean }) => (
  <svg {...base} width={22} height={22} style={{ transform: up ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);
