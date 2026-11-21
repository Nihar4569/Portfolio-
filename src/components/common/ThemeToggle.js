import React, { useContext } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { ThemeContext } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const nextMode = isDark ? 'Light' : 'Dark';
  const Icon = isDark ? FiSun : FiMoon;

  return (
    <button className="portfolio-theme-switch" type="button" data-sound="theme"
      onClick={toggleTheme} aria-label={`Switch to ${nextMode.toLowerCase()} mode`}>
      <Icon aria-hidden="true" />
      <span>{nextMode}</span>
    </button>
  );
}
