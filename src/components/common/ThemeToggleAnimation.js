import React, { useContext, useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggleAnimation = () => {
  const { isAnimating, animationPhase, targetTheme } = useContext(ThemeContext);
  const [codeLines, setCodeLines] = useState([]);
  const [terminalLines, setTerminalLines] = useState([]);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  const toLight = targetTheme === 'light';
  const primaryColor = toLight ? '#3498db' : '#00bcd4';
  const secondaryColor = toLight ? '#2ecc71' : '#00e676';

  // Code that "runs" during transition
  const darkModeCode = [
    { type: 'comment', text: '// Initializing dark mode...' },
    { type: 'import', text: "import { darkTheme } from './themes';" },
    { type: 'blank', text: '' },
    { type: 'keyword', text: 'const', rest: ' applyTheme = async () => {' },
    { type: 'code', text: "  document.body.dataset.theme = 'dark';" },
    { type: 'code', text: "  setBackground('#0d1117');" },
    { type: 'code', text: "  setPrimaryColor('#00bcd4');" },
    { type: 'code', text: "  setTextColor('#e0e0e0');" },
    { type: 'keyword', text: '  await', rest: ' animateTransition();' },
    { type: 'code', text: '  console.log("✓ Dark mode activated");' },
    { type: 'code', text: '};' },
    { type: 'blank', text: '' },
    { type: 'execute', text: 'applyTheme();' },
  ];

  const lightModeCode = [
    { type: 'comment', text: '// Initializing light mode...' },
    { type: 'import', text: "import { lightTheme } from './themes';" },
    { type: 'blank', text: '' },
    { type: 'keyword', text: 'const', rest: ' applyTheme = async () => {' },
    { type: 'code', text: "  document.body.dataset.theme = 'light';" },
    { type: 'code', text: "  setBackground('#ffffff');" },
    { type: 'code', text: "  setPrimaryColor('#3498db');" },
    { type: 'code', text: "  setTextColor('#1a1a2e');" },
    { type: 'keyword', text: '  await', rest: ' animateTransition();' },
    { type: 'code', text: '  console.log("✓ Light mode activated");' },
    { type: 'code', text: '};' },
    { type: 'blank', text: '' },
    { type: 'execute', text: 'applyTheme();' },
  ];

  const terminalOutput = toLight ? [
    '$ theme --switch light',
    '→ Loading light theme modules...',
    '→ Updating CSS variables...',
    '→ Applying color palette...',
    '→ Refreshing components...',
    '✓ Theme switched successfully!',
  ] : [
    '$ theme --switch dark',
    '→ Loading dark theme modules...',
    '→ Updating CSS variables...',
    '→ Applying color palette...',
    '→ Refreshing components...',
    '✓ Theme switched successfully!',
  ];

  // Animate code lines appearing one by one
  useEffect(() => {
    if (isAnimating && animationPhase === 'starting') {
      const code = toLight ? lightModeCode : darkModeCode;
      setCodeLines([]);
      setTerminalLines([]);
      setActiveLineIndex(-1);

      // Add code lines with delay
      code.forEach((line, index) => {
        setTimeout(() => {
          setCodeLines(prev => [...prev, line]);
          setActiveLineIndex(index);
        }, index * 60);
      });

      // Add terminal lines
      terminalOutput.forEach((line, index) => {
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line]);
        }, 300 + index * 100);
      });
    }

    if (animationPhase === 'idle') {
      setCodeLines([]);
      setTerminalLines([]);
      setActiveLineIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, animationPhase, toLight]);

  const renderCodeLine = useCallback((line, index) => {
    const isActive = index === activeLineIndex;
    
    switch (line.type) {
      case 'comment':
        return <CommentLine key={index} isActive={isActive}>{line.text}</CommentLine>;
      case 'import':
        return (
          <CodeLine key={index} isActive={isActive}>
            <Keyword>import</Keyword>
            <String> {'{ '}{toLight ? 'lightTheme' : 'darkTheme'}{' }'}</String>
            <Keyword> from</Keyword>
            <String> './themes'</String>;
          </CodeLine>
        );
      case 'keyword':
        return (
          <CodeLine key={index} isActive={isActive}>
            <Keyword>{line.text}</Keyword>
            <span>{line.rest}</span>
          </CodeLine>
        );
      case 'code':
        return <CodeLine key={index} isActive={isActive}>{highlightCode(line.text)}</CodeLine>;
      case 'execute':
        return (
          <ExecuteLine key={index} isActive={isActive} primaryColor={primaryColor}>
            <Function>{line.text.replace('();', '')}</Function>
            <span>();</span>
          </ExecuteLine>
        );
      case 'blank':
        return <BlankLine key={index} />;
      default:
        return <CodeLine key={index} isActive={isActive}>{line.text}</CodeLine>;
    }
  }, [activeLineIndex, toLight, primaryColor]);

  const highlightCode = (text) => {
    // Simple syntax highlighting
    return text
      .split(/('.*?'|".*?")/g)
      .map((part, i) => {
        if (part.startsWith("'") || part.startsWith('"')) {
          return <String key={i}>{part}</String>;
        }
        // Highlight specific words
        return part
          .split(/(document|body|dataset|console|log|await|setBackground|setPrimaryColor|setTextColor|animateTransition)/g)
          .map((word, j) => {
            if (['document', 'body', 'dataset', 'console'].includes(word)) {
              return <Variable key={`${i}-${j}`}>{word}</Variable>;
            }
            if (['setBackground', 'setPrimaryColor', 'setTextColor', 'animateTransition', 'log'].includes(word)) {
              return <Function key={`${i}-${j}`}>{word}</Function>;
            }
            if (word === 'await') {
              return <Keyword key={`${i}-${j}`}>{word}</Keyword>;
            }
            return word;
          });
      });
  };

  if (!isAnimating) return null;

  return (
    <TransitionOverlay phase={animationPhase}>
      {/* Gradient backdrop with smooth transition */}
      <Backdrop phase={animationPhase} toLight={toLight} />
      
      {/* Matrix-style falling characters in background */}
      <MatrixRain phase={animationPhase}>
        {[...Array(20)].map((_, i) => {
          const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
          return (
            <MatrixColumn 
              key={i} 
              style={{ 
                left: `${i * 5}%`, 
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + i * 0.1}s`
              }}
              primaryColor={primaryColor}
            >
              {[...Array(30)].map((_, j) => (
                <MatrixChar key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                  {chars[j % chars.length]}
                </MatrixChar>
              ))}
            </MatrixColumn>
          );
        })}
      </MatrixRain>

      {/* Main content container */}
      <ContentContainer phase={animationPhase}>
        {/* Code editor window */}
        <CodeWindow phase={animationPhase} toLight={toLight}>
          <WindowHeader toLight={toLight}>
            <WindowControls>
              <WindowButton color="#ff5f56" />
              <WindowButton color="#ffbd2e" />
              <WindowButton color="#27c93f" />
            </WindowControls>
            <WindowTitle toLight={toLight}>
              theme-config.js — Visual Studio Code
            </WindowTitle>
            <WindowTabs>
              <Tab active toLight={toLight}>theme-config.js</Tab>
            </WindowTabs>
          </WindowHeader>
          
          <CodeContent toLight={toLight}>
            <LineNumbers toLight={toLight}>
              {codeLines.map((_, i) => (
                <LineNumber key={i} isActive={i === activeLineIndex} primaryColor={primaryColor}>
                  {i + 1}
                </LineNumber>
              ))}
            </LineNumbers>
            <CodeArea>
              {codeLines.map((line, index) => renderCodeLine(line, index))}
              <Cursor primaryColor={primaryColor} />
            </CodeArea>
          </CodeContent>
        </CodeWindow>

        {/* Terminal window */}
        <TerminalWindow phase={animationPhase} toLight={toLight}>
          <WindowHeader toLight={toLight} isTerminal>
            <WindowControls>
              <WindowButton color="#ff5f56" />
              <WindowButton color="#ffbd2e" />
              <WindowButton color="#27c93f" />
            </WindowControls>
            <WindowTitle toLight={toLight}>
              Terminal — zsh
            </WindowTitle>
          </WindowHeader>
          
          <TerminalContent>
            {terminalLines.map((line, index) => (
              <TerminalLine 
                key={index} 
                isCommand={line.startsWith('$')}
                isSuccess={line.startsWith('✓')}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              >
                {line}
              </TerminalLine>
            ))}
            <TerminalCursor primaryColor={primaryColor}>█</TerminalCursor>
          </TerminalContent>
        </TerminalWindow>
      </ContentContainer>

      {/* Floating code snippets */}
      <FloatingSnippets phase={animationPhase}>
        <FloatingSnippet 
          style={{ top: '10%', left: '5%', animationDelay: '0.2s' }}
          primaryColor={primaryColor}
        >
          <SnippetText>background: {toLight ? '#fff' : '#0d1117'}</SnippetText>
        </FloatingSnippet>
        <FloatingSnippet 
          style={{ top: '20%', right: '8%', animationDelay: '0.4s' }}
          primaryColor={primaryColor}
        >
          <SnippetText>color: {toLight ? '#1a1a2e' : '#e0e0e0'}</SnippetText>
        </FloatingSnippet>
        <FloatingSnippet 
          style={{ bottom: '25%', left: '10%', animationDelay: '0.6s' }}
          primaryColor={primaryColor}
        >
          <SnippetText>--primary: {primaryColor}</SnippetText>
        </FloatingSnippet>
        <FloatingSnippet 
          style={{ bottom: '15%', right: '5%', animationDelay: '0.8s' }}
          primaryColor={primaryColor}
        >
          <SnippetText>theme: '{toLight ? 'light' : 'dark'}'</SnippetText>
        </FloatingSnippet>
      </FloatingSnippets>

      {/* Progress indicator */}
      <ProgressContainer phase={animationPhase}>
        <ProgressLabel primaryColor={primaryColor}>
          {toLight ? '☀ APPLYING LIGHT THEME' : '🌙 APPLYING DARK THEME'}
        </ProgressLabel>
        <ProgressTrack>
          <ProgressBar primaryColor={primaryColor} secondaryColor={secondaryColor} />
        </ProgressTrack>
        <ProgressPercent primaryColor={primaryColor} />
      </ProgressContainer>

      {/* Scan effect */}
      <ScanEffect phase={animationPhase} primaryColor={primaryColor} />
    </TransitionOverlay>
  );
};

// Keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideInLeft = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-50px) scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1);
  }
`;

const slideInRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(50px) scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1);
  }
`;

const slideOut = keyframes`
  from { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
  to { 
    opacity: 0; 
    transform: translateY(-30px) scale(0.95);
  }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const matrixFall = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.5; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const matrixGlow = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const progressAnim = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const percentCount = keyframes`
  0% { content: '0%'; }
  10% { content: '10%'; }
  20% { content: '20%'; }
  30% { content: '30%'; }
  40% { content: '40%'; }
  50% { content: '50%'; }
  60% { content: '60%'; }
  70% { content: '70%'; }
  80% { content: '80%'; }
  90% { content: '90%'; }
  100% { content: '100%'; }
`;

const scanAnim = keyframes`
  0% { top: -5%; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { top: 105%; opacity: 0; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
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
    animation: ${fadeIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
  
  ${props => props.phase === 'ending' && css`
    animation: ${fadeOut} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.toLight
    ? 'linear-gradient(135deg, rgba(240,248,255,0.98) 0%, rgba(255,255,255,0.95) 50%, rgba(220,235,250,0.98) 100%)'
    : 'linear-gradient(135deg, rgba(13,17,23,0.98) 0%, rgba(22,27,34,0.95) 50%, rgba(13,17,23,0.98) 100%)'
  };
  backdrop-filter: blur(10px);
  transition: background 0.5s ease;
`;

const MatrixRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: ${props => props.phase === 'ending' ? 0 : 0.15};
  transition: opacity 0.3s ease;
`;

const MatrixColumn = styled.div`
  position: absolute;
  top: 0;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  color: ${props => props.primaryColor};
  writing-mode: vertical-rl;
  animation: ${matrixFall} linear infinite;
`;

const MatrixChar = styled.span`
  display: block;
  animation: ${matrixGlow} 2s ease-in-out infinite;
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20px;
  max-width: 95vw;
  
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
  
  ${props => props.phase === 'ending' && css`
    animation: ${slideOut} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `}
`;

const CodeWindow = styled.div`
  width: 480px;
  background: ${props => props.toLight ? '#1e1e1e' : '#1e1e1e'};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  ${props => props.phase === 'starting' && css`
    animation: ${slideInLeft} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}
  
  @media (max-width: 900px) {
    width: 90vw;
    max-width: 400px;
  }
`;

const TerminalWindow = styled.div`
  width: 350px;
  background: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  ${props => props.phase === 'starting' && css`
    animation: ${slideInRight} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards;
    opacity: 0;
  `}
  
  @media (max-width: 900px) {
    width: 90vw;
    max-width: 400px;
  }
`;

const WindowHeader = styled.div`
  background: ${props => props.isTerminal ? '#2d2d2d' : '#323233'};
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
`;

const WindowButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const WindowTitle = styled.div`
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #888;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`;

const WindowTabs = styled.div`
  display: flex;
  gap: 2px;
`;

const Tab = styled.div`
  padding: 4px 12px;
  background: ${props => props.active ? '#1e1e1e' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#888'};
  font-size: 11px;
  border-radius: 4px 4px 0 0;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`;

const CodeContent = styled.div`
  display: flex;
  padding: 15px 0;
  min-height: 280px;
  background: #1e1e1e;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
`;

const LineNumbers = styled.div`
  padding: 0 15px;
  text-align: right;
  color: #858585;
  user-select: none;
  border-right: 1px solid #333;
  min-width: 40px;
`;

const LineNumber = styled.div`
  color: ${props => props.isActive ? props.primaryColor : '#858585'};
  transition: color 0.2s ease;
`;

const CodeArea = styled.div`
  padding: 0 15px;
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const CodeLine = styled.div`
  color: #d4d4d4;
  white-space: pre;
  opacity: ${props => props.isActive ? 1 : 0.8};
  transform: ${props => props.isActive ? 'translateX(3px)' : 'translateX(0)'};
  transition: all 0.2s ease;
  
  ${props => props.isActive && css`
    background: rgba(255, 255, 255, 0.05);
    margin: 0 -15px;
    padding: 0 15px;
  `}
`;

const CommentLine = styled(CodeLine)`
  color: #6a9955;
  font-style: italic;
`;

const ExecuteLine = styled(CodeLine)`
  color: ${props => props.primaryColor};
  font-weight: 500;
  
  ${props => props.isActive && css`
    animation: ${glowPulse} 1s ease infinite;
    color: ${props.primaryColor};
  `}
`;

const BlankLine = styled.div`
  height: 1.6em;
`;

const Keyword = styled.span`
  color: #569cd6;
`;

const String = styled.span`
  color: #ce9178;
`;

const Variable = styled.span`
  color: #9cdcfe;
`;

const Function = styled.span`
  color: #dcdcaa;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: ${props => props.primaryColor};
  animation: ${blink} 1s step-end infinite;
  vertical-align: middle;
  margin-left: 2px;
  box-shadow: 0 0 10px ${props => props.primaryColor};
`;

const TerminalContent = styled.div`
  padding: 15px;
  min-height: 200px;
  background: #0d1117;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.8;
`;

const TerminalLine = styled.div`
  color: ${props => {
    if (props.isCommand) return '#fff';
    if (props.isSuccess) return props.secondaryColor;
    return '#8b949e';
  }};
  
  ${props => props.isCommand && css`
    &::before {
      content: '';
      color: ${props.primaryColor};
    }
  `}
  
  ${props => props.isSuccess && css`
    font-weight: 600;
  `}
`;

const TerminalCursor = styled.span`
  color: ${props => props.primaryColor};
  animation: ${blink} 1s step-end infinite;
`;

const FloatingSnippets = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${props => props.phase === 'ending' ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const FloatingSnippet = styled.div`
  position: absolute;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid ${props => props.primaryColor}40;
  border-radius: 6px;
  padding: 8px 14px;
  animation: ${float} 3s ease-in-out infinite, ${fadeIn} 0.5s ease forwards;
  opacity: 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '{ }';
    position: absolute;
    top: -8px;
    left: 10px;
    background: ${props => props.primaryColor};
    color: #000;
    font-size: 8px;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Fira Code', monospace;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SnippetText = styled.code`
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #e0e0e0;
`;

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  
  ${props => props.phase === 'starting' && css`
    animation: ${fadeIn} 0.5s ease 0.3s forwards;
    opacity: 0;
  `}
  
  ${props => props.phase === 'ending' && css`
    animation: ${fadeOut} 0.3s ease forwards;
  `}
`;

const ProgressLabel = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.primaryColor};
  letter-spacing: 3px;
  margin-bottom: 12px;
  text-shadow: 0 0 20px ${props => props.primaryColor}60;
`;

const ProgressTrack = styled.div`
  width: 250px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 200px;
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.primaryColor}, ${props => props.secondaryColor});
  border-radius: 2px;
  animation: ${progressAnim} 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  box-shadow: 0 0 15px ${props => props.primaryColor};
`;

const ProgressPercent = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: ${props => props.primaryColor};
  margin-top: 8px;
  
  &::after {
    content: '0%';
    animation: ${percentCount} 1s steps(10) forwards;
  }
`;

const ScanEffect = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    ${props => props.primaryColor}40 20%,
    ${props => props.primaryColor} 50%,
    ${props => props.primaryColor}40 80%,
    transparent 100%
  );
  box-shadow: 
    0 0 30px ${props => props.primaryColor},
    0 0 60px ${props => props.primaryColor}50;
  animation: ${scanAnim} 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: ${props => props.phase === 'ending' ? 0 : 1};
`;

export default ThemeToggleAnimation;
