import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggleAnimation = () => {
  const { isAnimating, isDark } = useContext(ThemeContext);
  const [activeWindows, setActiveWindows] = useState([false, false, false, false]);
  const [activeCelestial, setActiveCelestial] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      // Staggered animation for code windows
      setTimeout(() => setActiveWindows([true, false, false, false]), 100);
      setTimeout(() => setActiveWindows([true, true, false, false]), 300);
      setTimeout(() => setActiveWindows([true, true, true, false]), 500);
      setTimeout(() => setActiveWindows([true, true, true, true]), 700);
      
      // Animate celestial body (sun/moon)
      setTimeout(() => setActiveCelestial(true), 200);
      
      // Reset animations after they're done
      return () => {
        setTimeout(() => {
          setActiveWindows([false, false, false, false]);
          setActiveCelestial(false);
        }, 1500);
      };
    }
  }, [isAnimating]);

  if (!isAnimating) return null;

  return (
    <TransitionOverlay className="active">
      <ThemeOverlay className={isDark ? 'dark' : 'light'} />
      
      <CelestialBody 
        className={`${isDark ? 'moon' : 'sun'} ${activeCelestial ? 'active' : ''}`} 
      />
      
      {/* Code Windows - Only show these when going to dark mode */}
      {isDark && (
        <>
          <CodeWindow className={`window1 ${activeWindows[0] ? 'active' : ''}`}>
            <WindowHeader>
              <WindowButton className="red" />
              <WindowButton className="yellow" />
              <WindowButton className="green" />
              <WindowTitle>theme-toggle.js</WindowTitle>
            </WindowHeader>
            <CodeContent>
              <div className="line">
                <span className="keyword">const</span> <span className="variable">toggleTheme</span> = <span className="keyword">()</span> {'=> {'} 
              </div>
              <div className="line">  <span className="variable">setIsDark</span>(!<span className="variable">isDark</span>);</div>
              <div className="line">{'}'}</div>
            </CodeContent>
          </CodeWindow>
          
          <CodeWindow className={`window2 ${activeWindows[1] ? 'active' : ''}`}>
            <WindowHeader>
              <WindowButton className="red" />
              <WindowButton className="yellow" />
              <WindowButton className="green" />
              <WindowTitle>styles.js</WindowTitle>
            </WindowHeader>
            <CodeContent>
              <div className="line">
                <span className="keyword">const</span> <span className="variable">darkTheme</span> = {'{'} 
              </div>
              <div className="line">  <span className="variable">background</span>: <span className="string">'#0d1117'</span>,</div>
              <div className="line">  <span className="variable">text</span>: <span className="string">'#e0e0e0'</span></div>
              <div className="line">{'}'}</div>
            </CodeContent>
          </CodeWindow>
          
          <CodeWindow className={`window3 ${activeWindows[2] ? 'active' : ''}`}>
            <WindowHeader>
              <WindowButton className="red" />
              <WindowButton className="yellow" />
              <WindowButton className="green" />
              <WindowTitle>settings.json</WindowTitle>
            </WindowHeader>
            <CodeContent>
              <div className="line">{'{'}</div>
              <div className="line">  <span className="string">"theme"</span>: <span className="string">"dark"</span>,</div>
              <div className="line">  <span className="string">"color"</span>: <span className="string">"#00e676"</span></div>
              <div className="line">{'}'}</div>
            </CodeContent>
          </CodeWindow>
          
          <CodeWindow className={`window4 ${activeWindows[3] ? 'active' : ''}`}>
            <WindowHeader>
              <WindowButton className="red" />
              <WindowButton className="yellow" />
              <WindowButton className="green" />
              <WindowTitle>terminal</WindowTitle>
            </WindowHeader>
            <CodeContent>
              <div className="line">
                <span className="variable">$ </span>
                <span className="function">activate-dark-mode</span> <span className="variable">--all</span>
              </div>
              <div className="line">
                <span className="comment">// Activating dark mode...</span>
              </div>
              <div className="line">
                <span className="comment">// Dark mode enabled!</span>
              </div>
              <div className="line">
                <span className="variable">$ _</span><span className="typing-cursor"></span>
              </div>
            </CodeContent>
          </CodeWindow>
        </>
      )}
    </TransitionOverlay>
  );
};

// Styled Components
// In ThemeToggleAnimation.js
// In your ThemeToggleAnimation.js component
const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1500; // Higher z-index to appear above navbar
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  display: none; /* Hide by default */
  
  &.active {
    opacity: 1;
    visibility: visible;
    display: block;
  }
`;
const ThemeOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 1.5s ease;
  
  &.dark {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  &.light {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const CelestialBody = styled.div`
  position: absolute;
  top: -100px;
  right: 50px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  transition: all 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  
  &.sun {
    background: #FFD700;
    box-shadow: 0 0 50px #FFD700;
  }
  
  &.moon {
    background: #E6E6FA;
    box-shadow: 0 0 50px #E6E6FA;
  }
  
  &.active {
    top: 100px;
  }
`;

const CodeWindow = styled.div`
  position: absolute;
  background: rgba(40, 42, 54, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  font-family: 'Fira Code', monospace;
  color: #f8f8f2;
  transform: scale(0);
  opacity: 0;
  transition: all 1s ease;
  
  &.window1 {
    top: 30%;
    left: 20%;
    width: 300px;
    height: 120px;
    transition-delay: 0.2s;
  }
  
  &.window2 {
    top: 20%;
    right: 20%;
    width: 350px;
    height: 130px;
    transition-delay: 0.4s;
  }
  
  &.window3 {
    bottom: 30%;
    left: 25%;
    width: 280px;
    height: 120px;
    transition-delay: 0.6s;
  }
  
  &.window4 {
    bottom: 25%;
    right: 25%;
    width: 320px;
    height: 130px;
    transition-delay: 0.8s;
  }
  
  &.active {
    transform: scale(1);
    opacity: 1;
  }
`;

const WindowHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
`;

const WindowButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  
  &.red {
    background-color: #ff5f56;
  }
  
  &.yellow {
    background-color: #ffbd2e;
  }
  
  &.green {
    background-color: #27c93f;
  }
`;

const WindowTitle = styled.div`
  margin-left: 10px;
  font-size: 12px;
  color: #bbb;
`;

const CodeContent = styled.div`
  font-size: 12px;
  line-height: 1.5;
  overflow: hidden;
  
  .line {
    margin-bottom: 5px;
  }
  
  .keyword {
    color: #ff79c6;
  }
  
  .string {
    color: #f1fa8c;
  }
  
  .function {
    color: #50fa7b;
  }
  
  .comment {
    color: #6272a4;
  }
  
  .variable {
    color: #bd93f9;
  }
  
  .typing-cursor {
    display: inline-block;
    width: 2px;
    height: 14px;
    background-color: currentColor;
    margin-left: 2px;
    animation: blinking 1s infinite;
  }
  
  @keyframes blinking {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

export default ThemeToggleAnimation;