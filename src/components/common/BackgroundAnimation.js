import React, { useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';

const BackgroundAnimation = () => {
  const { isDark, theme } = useContext(ThemeContext);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Make canvas fill entire screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Code rain effect
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);
    
    // Different code symbols (mix of programming and cybersecurity)
    const symbols = [
      '0', '1', '{', '}', '()', '=>', '[]', 'if', 'for', 'while', 'class', 
      'function', 'const', 'let', 'var', '<div>', '</div>', '404', 'sudo',
      'npm', 'git', 'ssh', 'API', 'CORS', 'HTTP', 'GET', 'POST', 'SQL',
      'SELECT', 'FROM', 'import', 'export', 'React', 'Java', 'Spring', 
      'async', 'await', 'try', 'catch', 'null', 'undefined', 'proxy', 'hack',
      'node', 'mongo', 'docker', 'cloud', 'render', 'deploy', 'config',
      '🔒', '⚡', '💻', '👨‍💻', '🚀', '⚠️', '🔑', '📦', '🔍', '📡'
    ];
    
    // Binary pattern for background
    const createBinaryPattern = () => {
      const pattern = [];
      const width = Math.ceil(canvas.width / 10);
      const height = Math.ceil(canvas.height / 10);
      
      for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          row.push(Math.random() > 0.5 ? '1' : '0');
        }
        pattern.push(row);
      }
      
      return pattern;
    };
    
    const binaryPattern = createBinaryPattern();
    
    // Nodes for network visualization
    const createNodes = () => {
      const nodeCount = Math.floor(canvas.width / 200);
      const nodes = [];
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 2 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: []
        });
      }
      
      // Create connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * nodes.length);
          if (targetIndex !== i && !node.connections.includes(targetIndex)) {
            node.connections.push(targetIndex);
          }
        }
      }
      
      return nodes;
    };
    
    const nodes = createNodes();
    
    // Draw the background
    const draw = () => {
      // Set semi-transparent background to create trail effect
      ctx.fillStyle = isDark 
        ? 'rgba(13, 17, 23, 0.05)' 
        : 'rgba(240, 248, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw binary pattern
      if (Math.random() < 0.01) { // Occasionally update a cell
        const row = Math.floor(Math.random() * binaryPattern.length);
        const col = Math.floor(Math.random() * binaryPattern[0].length);
        binaryPattern[row][col] = binaryPattern[row][col] === '1' ? '0' : '1';
      }
      
      ctx.fillStyle = isDark ? 'rgba(0, 230, 118, 0.05)' : 'rgba(33, 150, 243, 0.03)';
      ctx.font = '8px monospace';
      
      for (let i = 0; i < binaryPattern.length; i++) {
        for (let j = 0; j < binaryPattern[i].length; j++) {
          if (binaryPattern[i][j] === '1') {
            ctx.fillText(binaryPattern[i][j], j * 10, i * 10);
          }
        }
      }
      
      // Draw network connections
      ctx.strokeStyle = isDark ? 'rgba(0, 230, 118, 0.1)' : 'rgba(33, 150, 243, 0.07)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update node position
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw connections
        for (let j = 0; j < node.connections.length; j++) {
          const targetNode = nodes[node.connections[j]];
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
        
        // Draw node
        ctx.fillStyle = isDark ? 'rgba(0, 230, 118, 0.2)' : 'rgba(33, 150, 243, 0.15)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw matrix-style code rain
      ctx.fillStyle = isDark ? theme.primary : theme.primary;
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        // Only draw some columns for performance
        if (Math.random() > 0.97) {
          // Random symbol from the array
          const symbolIndex = Math.floor(Math.random() * symbols.length);
          const text = symbols[symbolIndex];
          
          // x coordinate of the drop
          const x = i * 20;
          // y coordinate of the drop
          const y = drops[i] * 20;
          
          // Varying opacity for visual effect
          ctx.globalAlpha = Math.random() * 0.5 + 0.3;
          
          ctx.fillText(text, x, y);
          
          // Reset to default opacity
          ctx.globalAlpha = 1;
          
          // Randomly reset some drops to the top after they've reached a certain point
          if (y > canvas.height * 0.7 && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          // Increment y coordinate for next drop
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
  
  return (
    <CanvasContainer>
      <Canvas ref={canvasRef}></Canvas>
    </CanvasContainer>
  );
};

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  opacity: 0.3;
`;

export default BackgroundAnimation;