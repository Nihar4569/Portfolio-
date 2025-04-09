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
    if (isAnimating) return; // Prevent toggling during animation
    
    setIsAnimating(true);
    
    // We need to update theme first for smoother transition
    const newTheme = isDark ? lightTheme : darkTheme;
    setTheme(newTheme);
    
    // Then update isDark after a slight delay
    setTimeout(() => {
      setIsDark(!isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }, 100);
    
    // Animation duration - keep in sync with CSS animation duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isAnimating }}>
      {children}
    </ThemeContext.Provider>
  );
};