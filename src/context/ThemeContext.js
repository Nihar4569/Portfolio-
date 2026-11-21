import React, { createContext, useEffect, useLayoutEffect, useState } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme !== 'light');
  const theme = isDark ? darkTheme : lightTheme;

  useLayoutEffect(() => {
    const mode = isDark ? 'dark' : 'light';
    document.documentElement.dataset.theme = mode;
    document.querySelector('meta[name="color-scheme"]').content = mode;
    document.querySelector('meta[name="theme-color"]').content = theme.background;
  }, [isDark, theme]);

  useEffect(() => {
    function syncTheme(event) {
      if (event.key === 'theme' || event.key === null) {
        setIsDark(event.newValue !== 'light');
      }
    }
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  function toggleTheme() {
    const target = isDark ? 'light' : 'dark';
    setIsDark(target === 'dark');
    try {
      localStorage.setItem('theme', target);
    } catch {
      // The current page can still change theme when persistence is unavailable.
    }
  }

  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
}
