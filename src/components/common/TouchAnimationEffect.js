import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';

const TouchParticleEffect = () => {
  const { isDark, theme } = useContext(ThemeContext);
  const [touchEffects, setTouchEffects] = useState([]);
  const [touchParticles, setTouchParticles] = useState([]);
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

  // Handle touch events and animations
  useEffect(() => {
    if (!isTouchDevice) return;

    let animationFrameId;
    let lastParticleTime = 0;
    const particleInterval = 20; // ms between particle creation, same as cursor

    // Update touch particles and effects animation
    const updateAnimations = () => {
      const now = Date.now();
      
      // Update particles
      setTouchParticles(prevParticles => 
        prevParticles
          .filter(particle => now - particle.created < particle.lifetime)
          .map(particle => {
            // Calculate progress (0 to 1) through particle lifetime
            const progress = (now - particle.created) / particle.lifetime;
            
            // Move particle away from touch point, exactly like cursor
            const speed = 1 - progress; // Slow down as they age
            
            return {
              ...particle,
              x: particle.x + Math.cos(particle.angle) * speed * 1.2,
              y: particle.y + Math.sin(particle.angle) * speed * 1.2,
              progress
            };
          })
      );
      
      // Update click effects
      setTouchEffects(prevEffects => 
        prevEffects
          .filter(effect => now - effect.created < effect.lifetime)
      );
      
      animationFrameId = requestAnimationFrame(updateAnimations);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateAnimations);

    // Handle touch start - similar to mouse click
    const handleTouchStart = (e) => {
      const now = Date.now();
      
      // Create click-like effects for each touch point
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        
        // Create touch effect (identical to cursor click effect)
        setTouchEffects(prev => [
          ...prev, 
          {
            id: `touch-${now}-${i}`,
            x: touch.clientX,
            y: touch.clientY,
            created: now,
            lifetime: 600, // Same as cursor effect
            color: theme.primary
          }
        ]);
      }
    };

    // Handle touch move - create particles just like cursor trail
    const handleTouchMove = (e) => {
      const now = Date.now();
      
      // Only create particles at intervals
      if (now - lastParticleTime > particleInterval) {
        // For each active touch
        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          
          // Find previous position (if any)
          const prevTouch = touchParticles.find(p => p.touchId === touch.identifier);
          const prevX = prevTouch ? prevTouch.x : touch.clientX;
          const prevY = prevTouch ? prevTouch.y : touch.clientY;
          
          // Calculate movement angle for particle direction (same as cursor)
          const dx = touch.clientX - prevX;
          const dy = touch.clientY - prevY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only create particles if touch has moved significantly
          if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            
            // Add new particle - identical to cursor particle
            setTouchParticles(prevParticles => {
              const newParticle = {
                id: `particle-${now}-${i}`,
                touchId: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                size: Math.random() * 6 + 4, // Same as cursor
                color: theme.primary,
                lifetime: Math.random() * 500 + 500, // Same lifetime as cursor
                created: now,
                // Spread particles slightly from touch position
                offsetX: Math.random() * 6 - 3,
                offsetY: Math.random() * 6 - 3,
                // Particles move opposite to touch direction
                angle: angle + Math.PI + (Math.random() * 0.5 - 0.25)
              };
              
              return [...prevParticles, newParticle];
            });
          }
        }
        
        lastParticleTime = now;
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isTouchDevice, theme.primary, touchParticles]);

  // Only render on touch devices
  if (!isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Particle trail - identical to cursor particles */}
      {touchParticles.map(particle => (
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
      
      {/* Click effect rings - identical to cursor click effects */}
      {touchEffects.map(effect => (
        <ClickEffect
          key={effect.id}
          style={{
            left: effect.x,
            top: effect.y
          }}
          color={effect.color}
        />
      ))}
      
      {/* Touch indicator - based on cursor but adapted for touch */}
      {Array.from(new Set(touchParticles.map(p => p.touchId))).map(touchId => {
        // Find most recent particle for this touch
        const recentParticle = touchParticles
          .filter(p => p.touchId === touchId)
          .sort((a, b) => b.created - a.created)[0];
        
        // Only show if exists and not too old
        if (recentParticle && Date.now() - recentParticle.created < 100) {
          return (
            <TouchIndicator
              key={`indicator-${touchId}`}
              style={{
                left: `${recentParticle.x}px`,
                top: `${recentParticle.y}px`
              }}
              isDark={isDark}
              primary={theme.primary}
            >
              <TouchInner
                isDark={isDark}
                primary={theme.primary}
              />
            </TouchIndicator>
          );
        }
        return null;
      })}
    </>
  );
};

// Use the same animations as the cursor
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

// Styled Components - identical to cursor styled components
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

// Touch-specific components based on cursor styling
const TouchIndicator = styled.div`
  position: fixed;
  width: 36px;
  height: 36px;
  border: 3px solid ${props => props.primary};
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  box-shadow: 0 0 10px ${props => props.primary}80;
  opacity: 0.7;
`;

const TouchInner = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${props => props.primary};
  border-radius: 50%;
  box-shadow: 0 0 8px ${props => props.primary};
`;

export default TouchParticleEffect;