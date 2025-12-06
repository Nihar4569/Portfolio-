import React, { useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { HiSparkles } from 'react-icons/hi';
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';

const ThemeToggle = () => {
  const { isDark, toggleTheme, isAnimating } = useContext(ThemeContext);
  const { playThemeSwitch, playCodeTyping } = useSound();
  
  const handleToggle = () => {
    if (!isAnimating) {
      playThemeSwitch(); // Initial click sound
      toggleTheme();
      // Play keyboard typing sound during the coding animation (800ms duration)
      setTimeout(() => {
        playCodeTyping(700); // Typing sounds during code animation
      }, 100);
    }
  };
  
  return (
    <ToggleContainer>
      <ToggleButton 
        onClick={handleToggle} 
        disabled={isAnimating}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        $isDark={isDark}
        $isAnimating={isAnimating}
      >
        <IconWrapper $isDark={isDark}>
          <SunIcon $isDark={isDark}>
            <RiSunLine />
          </SunIcon>
          <MoonIcon $isDark={isDark}>
            <RiMoonClearLine />
          </MoonIcon>
          <ToggleSlider $isDark={isDark} />
        </IconWrapper>
        <ToggleText $isDark={isDark}>
          {isDark ? 'Light' : 'Dark'}
        </ToggleText>
        {isAnimating && <SparkleIcon><HiSparkles /></SparkleIcon>}
      </ToggleButton>
    </ToggleContainer>
  );
};

// Animations
const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(0, 230, 118, 0); }
`;

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
  50% { filter: drop-shadow(0 0 8px currentColor); }
`;

// Styled Components
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, rgba(13, 17, 23, 0.9), rgba(30, 30, 46, 0.9))' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 248, 255, 0.9))'};
  border: 2px solid ${props => props.$isDark 
    ? 'rgba(0, 230, 118, 0.5)' 
    : 'rgba(52, 152, 219, 0.5)'};
  color: ${props => props.theme.text};
  border-radius: 25px;
  padding: 8px 16px;
  cursor: ${props => props.disabled ? 'wait' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: ${props => props.$isDark 
    ? '0 4px 15px rgba(0, 230, 118, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
    : '0 4px 15px rgba(52, 152, 219, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.$isDark ? 'rgba(0, 230, 118, 0.2)' : 'rgba(52, 152, 219, 0.2)'},
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: ${props => props.$isDark ? '#00e676' : '#3498db'};
    box-shadow: ${props => props.$isDark 
      ? '0 8px 25px rgba(0, 230, 118, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(52, 152, 219, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5)'};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
  
  ${props => props.$isAnimating && css`
    animation: ${pulse} 0.5s ease infinite;
    pointer-events: none;
  `}
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 6px;
  }
`;

const IconWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 24px;
  background: ${props => props.$isDark 
    ? 'rgba(0, 0, 0, 0.3)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  transition: all 0.3s ease;
`;

const SunIcon = styled.div`
  font-size: 14px;
  color: ${props => props.$isDark ? 'rgba(255, 200, 50, 0.4)' : '#f39c12'};
  z-index: 1;
  transition: all 0.3s ease;
  ${props => !props.$isDark && css`
    animation: ${glow} 2s ease-in-out infinite;
  `}
`;

const MoonIcon = styled.div`
  font-size: 14px;
  color: ${props => props.$isDark ? '#a855f7' : 'rgba(168, 85, 247, 0.4)'};
  z-index: 1;
  transition: all 0.3s ease;
  ${props => props.$isDark && css`
    animation: ${glow} 2s ease-in-out infinite;
  `}
`;

const ToggleSlider = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #a855f7, #7c3aed)' 
    : 'linear-gradient(135deg, #fbbf24, #f59e0b)'};
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${props => props.$isDark ? '22px' : '0px'});
  box-shadow: ${props => props.$isDark 
    ? '0 2px 8px rgba(168, 85, 247, 0.5)' 
    : '0 2px 8px rgba(251, 191, 36, 0.5)'};
`;

const ToggleText = styled.span`
  color: ${props => props.$isDark ? '#00e676' : '#3498db'};
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.75rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SparkleIcon = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #fbbf24;
  font-size: 1rem;
  animation: ${sparkle} 0.8s ease-in-out infinite;
`;

export default ThemeToggle;