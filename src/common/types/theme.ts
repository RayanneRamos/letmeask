import { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export type ThemeProvider = {
  children?: ReactNode;
}

export type ThemeType = {
  theme: Theme;
  toggleTheme: () => void;
}