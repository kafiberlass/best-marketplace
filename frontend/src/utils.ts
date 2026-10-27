export const formatPrice = (value: number): string => `${value.toLocaleString('ru-RU')} ₽`;

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
