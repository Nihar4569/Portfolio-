import React, { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useTerminal } from '../../context/TerminalContext';
import { useSound } from '../../context/SoundContext';
import { FiGithub, FiLinkedin, FiMail, FiCode, FiHeart, FiTerminal } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

// Blinking cursor animation
const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(0, 230, 118, 0.3); }
  50% { box-shadow: 0 0 15px rgba(0, 230, 118, 0.6), 0 0 30px rgba(0, 230, 118, 0.3); }
`;

const Footer = () => {
    const { theme } = useContext(ThemeContext);
    const { openTerminal } = useTerminal();
    const { playClick, playNavigation } = useSound();

    const handleTerminalClick = () => {
        playClick();
        openTerminal();
    };

    const handleLinkClick = () => {
        playNavigation();
    };

    return (
        <FooterContainer>
            <FooterContent>
                <FooterSection>
                    <FooterLogo>
                        <FiCode />
                        <span>Nihar<FooterAccent>.</FooterAccent></span>
                    </FooterLogo>
                    <FooterTagline>
                        Software Engineer, passionate about building impactful applications.
                    </FooterTagline>
                </FooterSection>

                <FooterSection>
                    <FooterHeading>Quick Links</FooterHeading>
                    <FooterLinks>
                        <FooterLink>
                            <Link to="/" onClick={handleLinkClick}>Home</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/projects" onClick={handleLinkClick}>Projects</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/albums" onClick={handleLinkClick}>Photo Albums</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
                        </FooterLink>
                    </FooterLinks>
                </FooterSection>

                <FooterSection>
                    <FooterHeading>Connect</FooterHeading>
                    <SocialLinks>
                        <SocialLink href="https://github.com/Nihar4569" target="_blank" rel="noopener noreferrer">
                            <FiGithub /> GitHub
                        </SocialLink>
                        <SocialLink href="https://linkedin.com/in/nihar4569" target="_blank" rel="noopener noreferrer">
                            <FiLinkedin /> LinkedIn
                        </SocialLink>
                        <SocialLink href="https://leetcode.com/u/nihar4569/" target="_blank" rel="noopener noreferrer">
                            <SiLeetcode /> LeetCode
                        </SocialLink>
                        <SocialLink href="mailto:nihar4569@gmail.com">
                            <FiMail /> Email
                        </SocialLink>
                    </SocialLinks>
                </FooterSection>
            </FooterContent>

            <FooterDivider />

            <FooterBottom>
                <Copyright>
                    &copy; {new Date().getFullYear()} Nihar Ranjan Sahu. All rights reserved.
                </Copyright>
                <TerminalPrompt onClick={handleTerminalClick}>
                    <FiTerminal />
                    <span>nihar@portfolio</span>
                    <span className="tilde">~</span>
                    <span className="cursor">▋</span>
                </TerminalPrompt>
                <FooterCredits>
                    Made with <FiHeart style={{ color: theme.accent, margin: '0 4px', verticalAlign: 'middle' }} /> by Nihar
                </FooterCredits>
            </FooterBottom>
        </FooterContainer>
    );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: ${props => props.theme.surface};
  padding: 4rem 0 1.5rem;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 3rem 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0 1rem;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Fira Code', monospace;
  color: ${props => props.theme.text};
  
  svg {
    margin-right: 8px;
    font-size: 1.8rem;
    color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FooterAccent = styled.span`
  color: ${props => props.theme.primary};
`;

const FooterTagline = styled.p`
  color: ${props => props.theme.textSecondary};
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0 auto;
  }
`;

const FooterHeading = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: ${props => props.theme.primary};
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1.2rem;
    
    &:after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.8rem;
  
  a {
    color: ${props => props.theme.textSecondary};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
  
  svg {
    margin-right: 10px;
  }
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const FooterDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.borderColor};
  margin: 2rem auto;
  max-width: 1200px;
  width: calc(100% - 4rem);
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 0 1rem;
  }
`;

const Copyright = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const TerminalPrompt = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: ${props => props.theme.background === '#0d1117' 
    ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.9), rgba(13, 17, 23, 0.95))' 
    : 'linear-gradient(135deg, rgba(240, 248, 255, 0.9), rgba(248, 251, 255, 0.95))'};
  border: 1px solid ${props => props.theme.background === '#0d1117' 
    ? 'rgba(0, 230, 118, 0.4)' 
    : 'rgba(52, 152, 219, 0.4)'};
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.85rem;
  color: ${props => props.theme.background === '#0d1117' ? '#00e676' : '#3498db'};
  transition: all 0.3s ease;
  animation: ${glow} 3s ease-in-out infinite;
  
  svg {
    font-size: 1rem;
    color: ${props => props.theme.background === '#0d1117' ? '#00e676' : '#3498db'};
  }
  
  .tilde {
    color: ${props => props.theme.background === '#0d1117' ? '#64b5f6' : '#9b59b6'};
  }
  
  .cursor {
    color: ${props => props.theme.background === '#0d1117' ? '#00e676' : '#3498db'};
    animation: ${blink} 1s step-end infinite;
    font-size: 1rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.theme.background === '#0d1117' ? '#00e676' : '#3498db'};
    box-shadow: ${props => props.theme.background === '#0d1117'
      ? '0 5px 20px rgba(0, 230, 118, 0.4), 0 0 40px rgba(0, 230, 118, 0.2)'
      : '0 5px 20px rgba(52, 152, 219, 0.4), 0 0 40px rgba(52, 152, 219, 0.2)'};
    background: ${props => props.theme.background === '#0d1117'
      ? 'linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(30, 30, 46, 0.95))'
      : 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(248, 251, 255, 0.95))'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 0.8rem;
  }
`;

const FooterCredits = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export default Footer;