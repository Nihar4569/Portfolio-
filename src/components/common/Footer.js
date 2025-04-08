import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { FiGithub, FiLinkedin, FiMail, FiCode, FiHeart } from 'react-icons/fi';

const Footer = () => {
    const { theme } = useContext(ThemeContext);

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
                            <Link to="/">Home</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/projects">Projects</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/albums">Photo Albums</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/contact">Contact</Link>
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
`;

const FooterAccent = styled.span`
  color: ${props => props.theme.primary};
`;

const FooterTagline = styled.p`
  color: ${props => props.theme.textSecondary};
  max-width: 300px;
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const Copyright = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const FooterCredits = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
`;

export default Footer;