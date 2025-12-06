import React, { useContext, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggleAnimation = () => {
  const { isAnimating, animationPhase, targetTheme } = useContext(ThemeContext);
  const [ripples, setRipples] = useState([]);
  const [gridCells, setGridCells] = useState([]);

  // Determine colors based on target theme (what we're transitioning TO)
  const toLight = targetTheme === 'light';
  const primaryColor = toLight ? '#3498db' : '#00bcd4';
  const secondaryColor = toLight ? '#2ecc71' : '#00e676';

  // Generate grid cells for the wipe effect
  useEffect(() => {
    if (isAnimating && animationPhase === 'starting') {
      const cells = [];
      const cols = 12;
      const rows = 8;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Calculate delay based on diagonal distance from center
          const centerX = cols / 2;
          const centerY = rows / 2;
          const distance = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));
          const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
          const delay = (distance / maxDistance) * 0.4;
          
          cells.push({
            id: `${row}-${col}`,
            row,
            col,
            delay
          });
        }
      }
      setGridCells(cells);
      
      // Create ripple effects
      setRipples([
        { id: 1, delay: 0 },
        { id: 2, delay: 0.15 },
        { id: 3, delay: 0.3 }
      ]);
    }
    
    if (!isAnimating) {
      setGridCells([]);
      setRipples([]);
    }
  }, [isAnimating, animationPhase]);

  if (!isAnimating) return null;

  return (
    <TransitionOverlay phase={animationPhase}>
      {/* Smooth gradient backdrop */}
      <GradientBackdrop phase={animationPhase} toLight={toLight} />
      
      {/* Expanding ripples from center */}
      <RippleContainer>
        {ripples.map(ripple => (
          <Ripple
            key={ripple.id}
            style={{ animationDelay: `${ripple.delay}s` }}
            primaryColor={primaryColor}
            phase={animationPhase}
          />
        ))}
      </RippleContainer>
      
      {/* Grid wipe effect */}
      <GridContainer phase={animationPhase}>
        {gridCells.map(cell => (
          <GridCell
            key={cell.id}
            style={{
              gridRow: cell.row + 1,
              gridColumn: cell.col + 1,
              animationDelay: `${cell.delay}s`
            }}
            phase={animationPhase}
            toLight={toLight}
            primaryColor={primaryColor}
          />
        ))}
      </GridContainer>
      
      {/* Center focal point */}
      <CenterFocus phase={animationPhase}>
        <FocusRing primaryColor={primaryColor} delay={0} />
        <FocusRing primaryColor={primaryColor} delay={0.1} />
        <FocusRing primaryColor={primaryColor} delay={0.2} />
        
        <IconContainer phase={animationPhase}>
          {toLight ? (
            <SunIcon primaryColor={primaryColor}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </SunIcon>
          ) : (
            <MoonIcon primaryColor={primaryColor}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </MoonIcon>
          )}
        </IconContainer>
      </CenterFocus>
      
      {/* Floating particles */}
      <ParticleField phase={animationPhase}>
        {[...Array(30)].map((_, i) => (
          <FloatingParticle
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              '--size': `${Math.random() * 6 + 2}px`
            }}
            primaryColor={primaryColor}
          />
        ))}
      </ParticleField>
      
      {/* Scan line effect */}
      <ScanLine phase={animationPhase} primaryColor={primaryColor} />
      
      {/* Mode indicator text */}
      <ModeIndicator phase={animationPhase}>
        <ModeLabel primaryColor={primaryColor}>
          {toLight ? 'LIGHT MODE' : 'DARK MODE'}
        </ModeLabel>
        <ModeSubtext>
          {toLight ? '☀ Activating light theme...' : '🌙 Activating dark theme...'}
        </ModeSubtext>
        <ProgressBar phase={animationPhase}>
          <ProgressFill primaryColor={primaryColor} secondaryColor={secondaryColor} />
        </ProgressBar>
      </ModeIndicator>
      
      {/* Corner accents */}
      <CornerAccent position="top-left" primaryColor={primaryColor} phase={animationPhase} />
      <CornerAccent position="top-right" primaryColor={primaryColor} phase={animationPhase} />
      <CornerAccent position="bottom-left" primaryColor={primaryColor} phase={animationPhase} />
      <CornerAccent position="bottom-right" primaryColor={primaryColor} phase={animationPhase} />
    </TransitionOverlay>
  );
};

// Keyframes - All with smooth easing
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const rippleExpand = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
`;

const cellReveal = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const cellHide = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

const focusPulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
`;

const iconPop = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const iconExit = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0) rotate(180deg);
    opacity: 0;
  }
`;

const particleDrift = keyframes`
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  20% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
`;

const scanMove = keyframes`
  0% {
    top: -10%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 110%;
    opacity: 0;
  }
`;

const progressFill = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const cornerDraw = keyframes`
  0% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 40px;
    height: 40px;
    opacity: 1;
  }
`;

// Styled Components
const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
  overflow: hidden;
  
  ${props => props.phase === 'starting' && css`
    animation: ${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
  
  ${props => props.phase === 'ending' && css`
    animation: ${fadeOut} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
`;

const GradientBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.toLight
    ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.97) 0%, rgba(240,248,255,0.95) 50%, rgba(220,235,250,0.92) 100%)'
    : 'radial-gradient(ellipse at center, rgba(13,17,23,0.97) 0%, rgba(22,27,34,0.95) 50%, rgba(13,17,23,0.92) 100%)'
  };
  transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const RippleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Ripple = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid ${props => props.primaryColor};
  background: transparent;
  animation: ${rippleExpand} 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const GridContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 2px;
  padding: 2px;
  opacity: ${props => props.phase === 'ending' ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const GridCell = styled.div`
  background: ${props => props.toLight
    ? `linear-gradient(135deg, ${props.primaryColor}20, ${props.primaryColor}10)`
    : `linear-gradient(135deg, ${props.primaryColor}30, ${props.primaryColor}15)`
  };
  border-radius: 4px;
  border: 1px solid ${props => props.primaryColor}30;
  
  ${props => props.phase === 'starting' && css`
    animation: ${cellReveal} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}
  
  ${props => props.phase === 'ending' && css`
    animation: ${cellHide} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
`;

const CenterFocus = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  
  ${props => props.phase === 'ending' && css`
    opacity: 0;
    transition: opacity 0.3s ease;
  `}
`;

const FocusRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border: 2px solid ${props => props.primaryColor};
  border-radius: 50%;
  animation: ${focusPulse} 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: ${props => props.delay}s;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  
  ${props => props.phase === 'starting' && css`
    animation: ${iconPop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}
  
  ${props => props.phase === 'ending' && css`
    animation: ${iconExit} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
`;

const SunIcon = styled.div`
  width: 100%;
  height: 100%;
  color: ${props => props.primaryColor};
  filter: drop-shadow(0 0 20px ${props => props.primaryColor});
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const MoonIcon = styled.div`
  width: 100%;
  height: 100%;
  color: ${props => props.primaryColor};
  filter: drop-shadow(0 0 20px ${props => props.primaryColor});
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ParticleField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: ${props => props.phase === 'ending' ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const FloatingParticle = styled.div`
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: ${props => props.primaryColor};
  border-radius: 50%;
  box-shadow: 0 0 10px ${props => props.primaryColor};
  animation: ${particleDrift} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const ScanLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    ${props => props.primaryColor}50 20%,
    ${props => props.primaryColor} 50%,
    ${props => props.primaryColor}50 80%,
    transparent 100%
  );
  box-shadow: 0 0 20px ${props => props.primaryColor}, 0 0 40px ${props => props.primaryColor}50;
  animation: ${scanMove} 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: ${props => props.phase === 'ending' ? 0 : 1};
`;

const ModeIndicator = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  
  ${props => props.phase === 'starting' && css`
    animation: ${slideIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
    opacity: 0;
  `}
  
  ${props => props.phase === 'ending' && css`
    animation: ${slideOut} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
`;

const ModeLabel = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.primaryColor};
  text-shadow: 0 0 20px ${props => props.primaryColor}80;
  letter-spacing: 4px;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
`;

const ModeSubtext = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    width: 150px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.primaryColor}, ${props => props.secondaryColor});
  border-radius: 2px;
  animation: ${progressFill} 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  box-shadow: 0 0 10px ${props => props.primaryColor};
`;

const CornerAccent = styled.div`
  position: absolute;
  border-color: ${props => props.primaryColor};
  border-style: solid;
  border-width: 0;
  animation: ${cornerDraw} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: ${props => props.phase === 'ending' ? 0 : 1};
  transition: opacity 0.3s ease;
  
  ${props => props.position === 'top-left' && css`
    top: 20px;
    left: 20px;
    border-top-width: 3px;
    border-left-width: 3px;
    animation-delay: 0.1s;
  `}
  
  ${props => props.position === 'top-right' && css`
    top: 20px;
    right: 20px;
    border-top-width: 3px;
    border-right-width: 3px;
    animation-delay: 0.15s;
  `}
  
  ${props => props.position === 'bottom-left' && css`
    bottom: 20px;
    left: 20px;
    border-bottom-width: 3px;
    border-left-width: 3px;
    animation-delay: 0.2s;
  `}
  
  ${props => props.position === 'bottom-right' && css`
    bottom: 20px;
    right: 20px;
    border-bottom-width: 3px;
    border-right-width: 3px;
    animation-delay: 0.25s;
  `}
`;

export default ThemeToggleAnimation;
