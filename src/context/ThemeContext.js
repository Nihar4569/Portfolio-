import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode
  const [isAnimating, setIsAnimating] = useState(false);
  const [theme, setTheme] = useState(darkTheme); // Default to dark theme

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Only change if explicitly set to light, otherwise stay dark
    if (savedTheme === 'light') {
      setIsDark(false);
      setTheme(lightTheme);
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    setIsDark(!isDark);
    
    // Set theme immediately to avoid flicker
    setTheme(isDark ? lightTheme : darkTheme);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    
    // This will allow the animation to complete then turn it off
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500); // Shorter animation duration
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isAnimating }}>
      {children}
    </ThemeContext.Provider>
  );
};