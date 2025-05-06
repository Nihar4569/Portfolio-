import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';

const EnhancedAnimatedCursor = () => {
  const { isDark, theme } = useContext(ThemeContext);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [particles, setParticles] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Check if it's a touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0)
      );
    };
    
    checkTouch();
    window.addEventListener('resize', checkTouch);
    
    return () => {
      window.removeEventListener('resize', checkTouch);
    };
  }, []);

  // Track mouse position and create particles
  useEffect(() => {
    if (isTouchDevice) return;

    let animationFrameId;
    let lastParticleTime = 0;
    const particleInterval = 20; // ms between particle creation

    const updatePosition = (e) => {
      const now = Date.now();
      const newX = e.clientX;
      const newY = e.clientY;
      
      setPrevPosition(position);
      setPosition({ x: newX, y: newY });
      
      // Create particles when moving (at intervals)
      if (now - lastParticleTime > particleInterval) {
        setParticles(prevParticles => {
          // Calculate movement angle for particle direction
          const dx = newX - position.x;
          const dy = newY - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only create particles if cursor has moved significantly
          if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            
            // Add new particle
            const newParticle = {
              id: now,
              x: newX,
              y: newY,
              size: Math.random() * 6 + 4,
              color: theme.primary,
              lifetime: Math.random() * 500 + 500, // ms
              created: now,
              // Spread particles slightly from cursor position
              offsetX: Math.random() * 6 - 3,
              offsetY: Math.random() * 6 - 3,
              // Particles move opposite to cursor direction
              angle: angle + Math.PI + (Math.random() * 0.5 - 0.25)
            };
            
            lastParticleTime = now;
            return [...prevParticles, newParticle];
          }
          return prevParticles;
        });
      }
      
      if (!visible) setVisible(true);
    };

    // Update particles position and remove old ones
    const updateParticles = () => {
      const now = Date.now();
      
      setParticles(prevParticles => 
        prevParticles
          .filter(particle => now - particle.created < particle.lifetime)
          .map(particle => {
            // Calculate progress (0 to 1) through particle lifetime
            const progress = (now - particle.created) / particle.lifetime;
            
            // Move particle away from cursor
            const speed = 1 - progress; // Slow down as they age
            
            return {
              ...particle,
              x: particle.x + Math.cos(particle.angle) * speed * 1.2,
              y: particle.y + Math.sin(particle.angle) * speed * 1.2,
              progress
            };
          })
      );
      
      // Also update click effects
      setClickEffects(prevEffects => 
        prevEffects
          .filter(effect => now - effect.created < effect.lifetime)
      );
      
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    window.addEventListener('mousemove', updatePosition);
    animationFrameId = requestAnimationFrame(updateParticles);
    
    // Hide cursor when mouse leaves the window
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice, position, visible, theme.primary]);

  // Track mouse clicks
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseDown = (e) => {
      setClicking(true);
      
      // Create click effect
      const now = Date.now();
      setClickEffects(prev => [
        ...prev, 
        {
          id: now,
          x: e.clientX,
          y: e.clientY,
          created: now,
          lifetime: 600, // ms
          color: theme.primary
        }
      ]);
    };
    
    const handleMouseUp = () => {
      setClicking(false);
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTouchDevice, theme.primary]);

  // Handle hovering on interactive elements
  useEffect(() => {
    if (isTouchDevice) return;

    const handleHoverStart = (e) => {
      const target = e.target;
      
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') || 
        target.closest('button') ||
        target.onclick ||
        target.style.cursor === 'pointer' ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setHovering(true);
      }
    };

    const handleHoverEnd = () => {
      setHovering(false);
    };

    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [isTouchDevice]);

  // Hide default cursor
  useEffect(() => {
    if (isTouchDevice) return;
    
    document.documentElement.style.cursor = 'none';
    
    // Add style to hide cursor on all elements
    const style = document.createElement('style');
    style.textContent = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      document.documentElement.style.cursor = '';
      document.head.removeChild(style);
    };
  }, [isTouchDevice]);

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Particle trail */}
      {particles.map(particle => (
        <Particle
          key={particle.id}
          style={{
            left: particle.x + particle.offsetX,
            top: particle.y + particle.offsetY,
            width: particle.size - (particle.progress * particle.size * 0.8),
            height: particle.size - (particle.progress * particle.size * 0.8),
            opacity: 1 - particle.progress,
            backgroundColor: particle.color
          }}
        />
      ))}
      
      {/* Click effect rings */}
      {clickEffects.map(effect => (
        <ClickEffect
          key={effect.id}
          style={{
            left: effect.x,
            top: effect.y
          }}
          color={effect.color}
        />
      ))}
      
      {/* Main cursor */}
      <CursorContainer 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: visible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${hovering ? 1.3 : (clicking ? 0.8 : 1)})`
        }}
      >
        <OuterRing 
          isDark={isDark}
          primary={theme.primary}
          hovering={hovering}
          clicking={clicking}
        >
          <InnerRing 
            isDark={isDark} 
            primary={theme.primary}
            clicking={clicking}
          />
        </OuterRing>
      </CursorContainer>
    </>
  );
};

// Animations
const pulseRing = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const clickEffectAnimation = keyframes`
  0% { 
    transform: translate(-50%, -50%) scale(0.5); 
    opacity: 1;
    border-width: 15px;
  }
  100% { 
    transform: translate(-50%, -50%) scale(1.5); 
    opacity: 0;
    border-width: 1px;
  }
`;

// Styled Components
const CursorContainer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  transition: transform 0.15s ease-out;
  will-change: transform, left, top;
`;

const OuterRing = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid ${props => props.primary};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.hovering 
    ? `${props.primary}20` 
    : 'transparent'};
  box-shadow: 0 0 10px ${props => props.primary}80;
  transition: background-color 0.2s ease, transform 0.2s ease;
`;

const InnerRing = styled.div`
  width: ${props => props.clicking ? '14px' : '10px'};
  height: ${props => props.clicking ? '14px' : '10px'};
  background-color: ${props => props.primary};
  border-radius: 50%;
  transition: width 0.2s ease, height 0.2s ease;
  box-shadow: 0 0 8px ${props => props.primary};
`;

const Particle = styled.div`
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px currentColor;
`;

const ClickEffect = styled.div`
  position: fixed;
  width: 40px;
  height: 40px;
  border: 5px solid ${props => props.color};
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.5);
  z-index: 9998;
  opacity: 1;
  animation: ${clickEffectAnimation} 0.6s forwards cubic-bezier(0.2, 0.6, 0.3, 1);
`;

export default EnhancedAnimatedCursor;