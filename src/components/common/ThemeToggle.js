import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDark, toggleTheme, isAnimating } = useContext(ThemeContext);
  
  const handleToggle = () => {
    if (!isAnimating) {
      toggleTheme();
    }
  };
  
  return (
    <ToggleButton onClick={handleToggle} aria-label="Toggle theme" isDark={isDark}>
      {isDark ? <FiSun /> : <FiMoon />}
    </ToggleButton>
  );
};

// Styled Components
const ToggleButton = styled.button`
  background: ${props => props.isDark 
    ? 'linear-gradient(145deg, #1e1e1e, #252525)' 
    : 'linear-gradient(145deg, #e6f7ff, #f0f9ff)'};
  box-shadow: ${props => props.isDark 
    ? '5px 5px 10px #151515, -5px -5px 10px #2d2d2d' 
    : '5px 5px 10px rgba(166, 209, 237, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.8)'};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.isDark ? '#00bcd4' : '#3498db'};
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
  }
`;

export default ThemeToggle;