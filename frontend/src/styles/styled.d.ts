import 'styled-components';
import type { AppTheme } from './theme';

// Тема становится типом DefaultTheme: в стилях доступны theme.colors.primary и т.д. с автодополнением
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}
