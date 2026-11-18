export type Theme = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: Theme;
  setMode: (mode: ThemeMode) => void;
}

