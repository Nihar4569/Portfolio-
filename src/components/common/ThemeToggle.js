import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiCode } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDark, toggleTheme, isAnimating } = useContext(ThemeContext);
  
  const handleToggle = () => {
    if (!isAnimating) {
      toggleTheme();
    }
  };
  
  return (
    <ToggleContainer>
      <ToggleButton 
        onClick={handleToggle} 
        disabled={isAnimating}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        isDark={isDark}
      >
        <ThemeIcon isDark={isDark}>
          {isDark ? <FiSun /> : <FiMoon />}
        </ThemeIcon>
        <ToggleText>
          {isDark ? '> switch --light' : '> switch --dark'}
        </ToggleText>
      </ToggleButton>
    </ToggleContainer>
  );
};

// Styled Components
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  background: ${props => props.isDark 
    ? 'rgba(13, 17, 23, 0.7)' 
    : 'rgba(240, 248, 255, 0.7)'};
  border: 1px solid ${props => props.isDark 
    ? 'rgba(79, 230, 118, 0.4)' 
    : 'rgba(52, 152, 219, 0.4)'};
  color: ${props => props.theme.text};
  border-radius: 20px;
  padding: 8px 15px;
  cursor: ${props => props.disabled ? 'wait' : 'pointer'};
  transition: all 0.3s ease;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    background: ${props => props.isDark 
      ? 'rgba(19, 23, 29, 0.9)' 
      : 'rgba(255, 255, 255, 0.9)'};
    
    span {
      color: ${props => props.isDark 
        ? props.theme.primary 
        : props.theme.primary};
    }
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

const ThemeIcon = styled.div`
  font-size: 1.1rem;
  color: ${props => props.isDark 
    ? props.theme.primary 
    : props.theme.primary};
  margin-right: 8px;
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const ToggleText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export default ThemeToggle;