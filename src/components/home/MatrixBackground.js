import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';

const MatrixBackground = () => {
  const canvasRef = useRef(null);
  const { isDark, theme } = useContext(ThemeContext);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Make canvas fill entire section
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Matrix rain effect
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    
    // Binary and coding symbols
    const symbols = [
      '0', '1', '{', '}', '()', '=>', '[]', 'if', 'for', 'while', 'class', 
      'function', 'const', 'let', 'var', '<div>', '</div>', '404', 'sudo',
      'npm', 'git', 'ssh', 'API', 'CORS', 'HTTP', 'GET', 'POST', 'SQL',
      'Java', 'React', 'Spring', 'import', 'export'
    ];
    
    const draw = () => {
      // Create a trail effect with semi-transparent background
      ctx.fillStyle = isDark 
        ? 'rgba(13, 17, 23, 0.1)' 
        : 'rgba(240, 248, 255, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = isDark ? theme.primary : theme.primary;
      ctx.font = `${fontSize}px 'Fira Code', monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Only animate some columns for better performance
        if (Math.random() > 0.97) {
          // Pick a random symbol
          const text = symbols[Math.floor(Math.random() * symbols.length)];
          
          // Random opacity for more depth
          ctx.globalAlpha = Math.random() * 0.5 + 0.2;
          
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          
          ctx.fillText(text, x, y);
          
          // Reset opacity
          ctx.globalAlpha = 1;
          
          // Randomly reset the drop after it's reached a certain point
          if (y > canvas.height * 0.7 && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          // Move drop down
          drops[i]++;
        }
      }
      
      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark, theme]);
  
  return <Canvas ref={canvasRef} />;
};

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.3;
`;

export default MatrixBackground;