import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FiHome, FiCode, FiAlertTriangle } from 'react-icons/fi';


const NotFoundPage = () => {
  const { isDark } = useContext(ThemeContext);
  const [countdown, setCountdown] = useState(10);
  const [typedText, setTypedText] = useState('');
  const errorText = '4:04 Page Not Found - Error: The requested resource could not be located on this server.';
  
  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Typing effect
  useEffect(() => {
    if (typedText.length < errorText.length) {
      const timer = setTimeout(() => {
        setTypedText(errorText.substring(0, typedText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [typedText]);
  
  return (
    <PageContainer>
      <GlitchOverlay />
      <ContentContainer>
        <ErrorCode isDark={isDark}>404</ErrorCode>
        
        <TerminalWindow>
          <TerminalHeader>
            <TerminalButton className="red" />
            <TerminalButton className="yellow" />
            <TerminalButton className="green" />
            <TerminalTitle>system-error ~ cat /var/log/errors.txt</TerminalTitle>
          </TerminalHeader>
          
          <TerminalBody>
            <TerminalLine>
              <TerminalPrompt>$</TerminalPrompt> cd /path/to/page
            </TerminalLine>
            <TerminalLine>
              <TerminalError>bash: cd: /path/to/page: No such file or directory</TerminalError>
            </TerminalLine>
            
            <TerminalLine>
              <TerminalPrompt>$</TerminalPrompt> find / -name "requested-page"
            </TerminalLine>
            <TerminalLine>
              <TerminalError>find: No matches found</TerminalError>
            </TerminalLine>
            
            <TerminalLine>
              <TerminalPrompt>$</TerminalPrompt> ERROR: {typedText}
              <TerminalCursor visible={typedText.length < errorText.length} />
            </TerminalLine>
            
            <TerminalLine>
              <TerminalPrompt>$</TerminalPrompt> Redirecting to homepage in {countdown} seconds...
            </TerminalLine>
            
            {countdown === 0 && (
              <TerminalLine>
                <TerminalPrompt>$</TerminalPrompt> <TerminalSuccess>Redirect initialized!</TerminalSuccess>
              </TerminalLine>
            )}
          </TerminalBody>
        </TerminalWindow>
        
        <MessageBox>
          <ErrorIcon>
            <FiAlertTriangle />
          </ErrorIcon>
          <ErrorMessage>
            <ErrorTitle>Page Not Found</ErrorTitle>
            <ErrorDescription>
              The page you're looking for doesn't exist or has been moved.
            </ErrorDescription>
          </ErrorMessage>
        </MessageBox>
        
        <ActionButtons>
          <HomeButton to="/">
            <FiHome /> Go Home
          </HomeButton>
          
          <ProjectsButton to="/projects">
            <FiCode /> View Projects
          </ProjectsButton>
        </ActionButtons>
      </ContentContainer>
    </PageContainer>
  );
};

// Animations
const glitch = keyframes`
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-5px, 5px);
  }
  40% {
    transform: translate(-5px, -5px);
  }
  60% {
    transform: translate(5px, 5px);
  }
  80% {
    transform: translate(5px, -5px);
  }
  100% {
    transform: translate(0);
  }
`;

const scanline = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// Styled Components
// In AlbumsPage.js, update the existing PageContainer
const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px; // Added this line
  
  @media (max-width: 768px) {
    padding-top: 70px; // Added this line
  }
`;

const GlitchOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    transparent 0%,
    rgba(32, 35, 42, 0.2) 50%,
    transparent 100%
  );
  background-size: 100% 4px;
  pointer-events: none;
  animation: ${scanline} 8s linear infinite;
  opacity: 0.3;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const ErrorCode = styled.h1`
  font-size: 10rem;
  font-weight: 900;
  margin: 0 0 2rem;
  position: relative;
  color: transparent;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #00e676, #2196f3)'
    : 'linear-gradient(135deg, #3498db, #2ecc71)'
  };
  -webkit-background-clip: text;
  background-clip: text;
  
  &::before, &::after {
    content: '404';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.isDark
      ? 'linear-gradient(135deg, #00e676, #2196f3)'
      : 'linear-gradient(135deg, #3498db, #2ecc71)'
    };
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  &::before {
    text-shadow: 2px 0 #00e676;
    animation: ${glitch} 3s infinite linear;
    opacity: 0.3;
  }
  
  &::after {
    text-shadow: -2px 0 #2196f3;
    animation: ${glitch} 2s infinite linear reverse;
    opacity: 0.3;
  }
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const TerminalWindow = styled.div`
  width: 100%;
  background-color: ${props => props.theme.isDark ? '#1e1e1e' : '#f1f1f1'};
  border-radius: 10px;
  overflow: hidden;
  font-family: 'Fira Code', monospace;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const TerminalHeader = styled.div`
  background-color: ${props => props.theme.isDark ? '#323232' : '#e0e0e0'};
  padding: 8px 15px;
  display: flex;
  align-items: center;
`;

const TerminalButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  
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

const TerminalTitle = styled.div`
  color: ${props => props.theme.isDark ? '#cccccc' : '#555555'};
  font-size: 0.8rem;
  margin-left: 8px;
`;

const TerminalBody = styled.div`
  padding: 15px;
  color: ${props => props.theme.isDark ? '#f0f0f0' : '#333333'};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const TerminalLine = styled.div`
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const TerminalPrompt = styled.span`
  color: ${props => props.theme.primary};
  margin-right: 10px;
`;

const TerminalError = styled.span`
  color: #ff5f56;
`;

const TerminalSuccess = styled.span`
  color: #27c93f;
`;

const TerminalCursor = styled.span`
  display: ${props => props.visible ? 'inline-block' : 'none'};
  width: 8px;
  height: 15px;
  background-color: ${props => props.theme.primary};
  animation: ${blink} 1s infinite;
  vertical-align: middle;
  margin-left: 5px;
`;

const MessageBox = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const ErrorIcon = styled.div`
  font-size: 2rem;
  margin-right: 1.5rem;
  color: ${props => props.theme.error};
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  flex-grow: 1;
`;

const ErrorTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: ${props => props.theme.text};
`;

const ErrorDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ProjectsButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: transparent;
  color: ${props => props.theme.primary};
  font-weight: 600;
  border: 2px solid ${props => props.theme.primary};
  border-radius: 8px;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export default NotFoundPage;