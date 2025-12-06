import React, { createContext, useState, useEffect, useCallback } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, starting, peak, ending
  const [theme, setTheme] = useState(darkTheme); // Default to dark theme
  const [targetTheme, setTargetTheme] = useState(null); // The theme we're transitioning to
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Only change if explicitly set to light, otherwise stay dark
    if (savedTheme === 'light') {
      setIsDark(false);
      setTheme(lightTheme);
    }
  }, []);
  
  const toggleTheme = useCallback(() => {
    if (isAnimating) return; // Prevent toggling during animation
    
    const newIsDark = !isDark;
    const newTheme = newIsDark ? darkTheme : lightTheme;
    
    // Store the target theme for the animation component
    setTargetTheme(newIsDark ? 'dark' : 'light');
    setIsAnimating(true);
    setAnimationPhase('starting');
    
    // Phase 1: Animation builds up - code typing animation plays
    // Theme switches at peak when the "execute" line runs
    setTimeout(() => {
      setAnimationPhase('peak');
      // Switch theme smoothly when overlay fully covers screen
      setTheme(newTheme);
      setIsDark(newIsDark);
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    }, 800); // Slightly longer for code to "execute"
    
    // Phase 2: Animation fades out - show success
    setTimeout(() => {
      setAnimationPhase('ending');
    }, 1200);
    
    // Phase 3: Complete - reset everything
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationPhase('idle');
      setTargetTheme(null);
    }, 1700);
  }, [isDark, isAnimating]);
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark, 
      toggleTheme, 
      isAnimating, 
      animationPhase,
      targetTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};