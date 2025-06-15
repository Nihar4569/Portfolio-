import React, { useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiDownload, FiCode } from 'react-icons/fi';
import Typewriter from 'typewriter-effect';
import MatrixBackground from './MatrixBackground';

const Hero = () => {
  const { isDark } = useContext(ThemeContext);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add loading animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <HeroContainer>
      <HeroBackground isDark={isDark}>
        <HexGrid />
        {isDark && <MatrixBackground />}
      </HeroBackground>
      
      <HeroContent isLoaded={isLoaded}>
        <HeroLeft>
          <Greeting>&gt; Hello, I'm</Greeting>
          <Name>Nihar Ranjan Sahu</Name>
          <Profession>
            <span>&gt; </span>
            <Typewriter
              options={{
                strings: [
                  'Software Engineer',
                  'Full Stack Developer',
                  'Java Developer',
                  'Web Developer',
                  'Problem Solver'
                ],
                autoStart: true,
                loop: true,
                wrapperClassName: 'typewriter-wrapper',
                cursorClassName: 'typewriter-cursor'
              }}
            />
          </Profession>
          
          <Terminal>
            <TerminalHeader>
              <TerminalButton className="red" />
              <TerminalButton className="yellow" />
              <TerminalButton className="green" />
              <TerminalTitle>nihar@portfolio ~ terminal</TerminalTitle>
            </TerminalHeader>
            <TerminalBody>
              <TerminalLine>
                <TerminalPrompt>nihar@portfolio:~$</TerminalPrompt> whoami
              </TerminalLine>
              <TerminalResponse>
                A passionate software engineer specializing in full-stack development with expertise in 
                Java, JavaScript, React, and Spring Boot. Winner of Smart India Hackathon 2022.
              </TerminalResponse>
              <TerminalLine>
                <TerminalPrompt>nihar@portfolio:~$</TerminalPrompt> ls skills
              </TerminalLine>
              <TerminalResponse>
                Java JavaScript React Node.js Spring-Boot MongoDB MySQL
              </TerminalResponse>
              <TerminalLine>
                <TerminalPrompt>nihar@portfolio:~$</TerminalPrompt> <TerminalCursor />
              </TerminalLine>
            </TerminalBody>
          </Terminal>
          
          <HeroButtons>
            <PrimaryButton to="/projects">
              <span>View Projects</span> <FiArrowRight />
            </PrimaryButton>
            
            <SecondaryButton 
              href="https://drive.google.com/file/d/1-oSPx8EYVKOZaC2TJ_gwjr_dqqBFJSXS/view?usp=drive_link" 
              target='_blank'
            >
              <span>Download Resume</span> <FiDownload />
            </SecondaryButton>
          </HeroButtons>
          
          <SocialLinks>
            <SocialLink href="https://github.com/Nihar4569" target="_blank" rel="noopener noreferrer">
              <FiGithub />
            </SocialLink>
            
            <SocialLink href="https://linkedin.com/in/nihar4569" target="_blank" rel="noopener noreferrer">
              <FiLinkedin />
            </SocialLink>
            
            <SocialLink href="mailto:nihar4569@gmail.com">
              <FiMail />
            </SocialLink>
          </SocialLinks>
        </HeroLeft>
        
        <HeroRight>
          <ProfileImageContainer>
            <ProfileImageGlow isDark={isDark} />
            <ProfileImage src="/images/placeholder/profile.png" alt="Nihar Ranjan Sahu" />
            <ProfileOverlay>
              <CodeTag><FiCode /> Developer</CodeTag>
            </ProfileOverlay>
          </ProfileImageContainer>
        </HeroRight>
      </HeroContent>
      
      <ScrollIndicator>
        <MouseIcon>
          <MouseWheel />
        </MouseIcon>
        <ScrollText>Scroll Down</ScrollText>
      </ScrollIndicator>
    </HeroContainer>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// Styled Components
const HeroContainer = styled.section`
  position: relative;
  min-height: 100vh;
  padding-bottom: 50px;
  display: flex;
  align-items: center;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding-top: 0;
    align-items: center;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: ${props => props.isDark 
    ? 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0d1117 100%)'
    : 'radial-gradient(circle at 50% 50%, #f0f7ff 0%, #f8f9fa 100%)'
  };
`;

const HexGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => props.theme.isDark
    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23252525' fill-opacity='0.1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%233498db' fill-opacity='0.05' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  };
  opacity: 0.6;
`;

const HeroContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 992px) {
    flex-direction: column-reverse;
    justify-content: center;
    text-align: center;
    padding-top: 0;
  }
  
  & > * {
    animation: ${fadeIn} 0.8s ease-out forwards;
    animation-play-state: ${props => props.isLoaded ? 'running' : 'paused'};
    opacity: 0;
  }
`;

const HeroLeft = styled.div`
  flex: 1;
  max-width: 600px;
  animation-delay: 0.2s;
  
  @media (max-width: 992px) {
    margin-top: 1rem;
  }
`;

const Greeting = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
  font-family: 'Fira Code', monospace;
`;

const Name = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.3rem;
  }
`;

const Profession = styled.div`
  font-size: 1.8rem;
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  min-height: 40px;
  font-family: 'Fira Code', monospace;
  display: flex;
  
  .typewriter-wrapper {
    color: ${props => props.theme.accent};
  }
  
  .typewriter-cursor {
    color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    justify-content: center;
  }
`;

const Terminal = styled.div`
  background-color: ${props => props.theme.isDark ? '#1e1e1e' : '#f1f1f1'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  font-family: 'Fira Code', monospace;
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
  display: flex;
  flex-wrap: wrap;
`;

const TerminalPrompt = styled.span`
  color: ${props => props.theme.primary};
  margin-right: 10px;
`;

const TerminalResponse = styled.div`
  color: ${props => props.theme.isDark ? '#cccccc' : '#555555'};
  margin: 5px 0 15px 20px;
  line-height: 1.6;
`;

const TerminalCursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 15px;
  background-color: ${props => props.theme.primary};
  animation: ${blink} 1s infinite;
  vertical-align: middle;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  color: white;
  font-weight: 600;
  border-radius: 5px;
  transition: all 0.3s ease;
  
  span {
    margin-right: 8px;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const SecondaryButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  background: transparent;
  color: ${props => props.theme.primary};
  font-weight: 600;
  border: 2px solid ${props => props.theme.primary};
  border-radius: 5px;
  transition: all 0.3s ease;
  
  span {
    margin-right: 8px;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    
    svg {
      transform: translateY(3px);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.2rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 1.3rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    color: ${props => props.theme.primary};
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const HeroRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  animation-delay: 0.4s;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 350px;
  height: 350px;
  
  @media (max-width: 768px) {
    width: 320px;
    height: 320px;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    width: 280px;
    height: 280px;
    margin-top: 30px;
  }
`;

const ProfileImageGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, rgba(0, 188, 212, 0.3) 0%, rgba(0, 230, 118, 0.3) 100%)'
    : 'linear-gradient(135deg, rgba(52, 152, 219, 0.3) 0%, rgba(46, 204, 113, 0.3) 100%)'
  };
  filter: blur(20px);
  opacity: 0.7;
  z-index: -1;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 20px;
  border: 4px solid ${props => props.theme.primary};
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ProfileOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 1rem;
`;

const CodeTag = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  font-family: 'Fira Code', monospace;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 700;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme.textSecondary};
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 1.2s;
  opacity: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MouseIcon = styled.div`
  width: 30px;
  height: 50px;
  border: 2px solid ${props => props.theme.textSecondary};
  border-radius: 15px;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  margin-bottom: 10px;
`;

const MouseWheel = styled.div`
  width: 6px;
  height: 10px;
  background-color: ${props => props.theme.primary};
  border-radius: 3px;
  animation: scroll 1.5s infinite;
  
  @keyframes scroll {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(15px);
      opacity: 0;
    }
  }
`;

const ScrollText = styled.span`
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export default Hero;
