import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiCode } from 'react-icons/fi';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);
  
  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
    }
  };
  
  return (
    <TransitionContainer
      className={`${transitionStage}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {transitionStage === "fadeOut" && (
        <TransitionOverlay>
          <CodingPersonAnimation>
            <CoderIcon>
              <FiCode />
            </CoderIcon>
            <TypewriterText>
              {getTransitionText(location.pathname)}
            </TypewriterText>
          </CodingPersonAnimation>
        </TransitionOverlay>
      )}
      {children}
    </TransitionContainer>
  );
};

// Helper function to get transition text based on route
const getTransitionText = (pathname) => {
  switch (pathname) {
    case '/projects':
      return "Loading projects...";
    case '/albums':
      return "Accessing photo gallery...";
    case '/contact':
      return "Opening communication channel...";
    default:
      return "Navigating...";
  }
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent }
  50% { border-color: #00bcd4 }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

// Styled Components
const TransitionContainer = styled.div`
  &.fadeIn {
    animation: ${fadeIn} 0.5s ease-in-out forwards;
  }
  
  &.fadeOut {
    animation: ${fadeOut} 0.5s ease-in-out forwards;
  }
`;

const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CodingPersonAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CoderIcon = styled.div`
  font-size: 5rem;
  color: ${props => props.theme.primary};
  margin-bottom: 2rem;
  animation: ${bounce} 1s ease infinite;
  
  svg {
    filter: drop-shadow(0 0 10px ${props => props.theme.primary}40);
  }
`;

const TypewriterText = styled.div`
  font-family: 'Fira Code', monospace;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  border-right: 0.15em solid #00bcd4;
  white-space: nowrap;
  overflow: hidden;
  margin: 0 auto;
  letter-spacing: 0.15em;
  animation: 
    ${typing} 2s steps(30, end),
    ${blinkCaret} 0.75s step-end infinite;
`;

export default PageTransition;