// Зелёная гамма - как на макетах BestMarketPlace
export const theme = {
  colors: {
    primary: '#4c9a4c',
    primaryDark: '#3b7f3b',
    primarySoft: '#e8f4e8',
    success: '#4c9a4c',
    successSoft: '#e8f4e8',
    danger: '#d64545',
    dangerSoft: '#fdecec',
    text: '#1f2a1f',
    muted: '#6b7568',
    border: '#d8dfd6',
    surface: '#ffffff',
    background: '#f5f7f3',
    accent: '#e8f4e8',
  },
  radius: '12px',
  shadow: '0 4px 16px rgba(31, 42, 31, 0.08)',
  mobile: '@media (max-width: 760px)',
};

export type AppTheme = typeof theme;
