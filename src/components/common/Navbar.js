import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiX, FiCode, FiHome, FiFolder, FiMail } from 'react-icons/fi';

const Navbar = () => {
  const { isDark, isAnimating } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <NavbarContainer scrolled={scrolled} isDark={isDark} isAnimating={isAnimating}>
      <NavContent>
        <LogoContainer>
          <Link to="/">
            <Logo>
              <FiCode />
              <LogoText>Nihar<LogoAccent>.</LogoAccent></LogoText>
            </Logo>
          </Link>
        </LogoContainer>
        
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <FiX /> : <FiMenu />}
        </MenuButton>
        
        <NavLinksDesktop>
          <NavLink active={location.pathname === '/'}>
            <Link to="/">
              <FiHome /> Home
            </Link>
          </NavLink>
          
          <NavLink active={location.pathname === '/projects'}>
            <Link to="/projects">
              <FiFolder /> Projects
            </Link>
          </NavLink>
          
          <NavLink active={location.pathname === '/contact'}>
            <Link to="/contact">
              <FiMail /> Contact
            </Link>
          </NavLink>
          
          <ThemeToggleContainer>
            <ThemeToggle />
          </ThemeToggleContainer>
        </NavLinksDesktop>
        
        <NavLinksMobile isOpen={isOpen}>
          <NavLinkMobile>
            <Link to="/">
              <FiHome /> Home
            </Link>
          </NavLinkMobile>
          
          <NavLinkMobile>
            <Link to="/projects">
              <FiFolder /> Projects
            </Link>
          </NavLinkMobile>
          
          <NavLinkMobile>
            <Link to="/contact">
              <FiMail /> Contact
            </Link>
          </NavLinkMobile>
          
          <ThemeToggleMobile>
            <ThemeToggle />
          </ThemeToggleMobile>
        </NavLinksMobile>
      </NavContent>
    </NavbarContainer>
  );
};

// Styled Components
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: ${props => props.isAnimating ? 900 : 1000}; // Lower z-index during animations
  background: ${props => props.scrolled 
    ? props.isDark 
      ? 'rgba(13, 17, 23, 0.95)' 
      : 'rgba(240, 248, 255, 0.95)'
    : props.isDark
      ? 'rgba(13, 17, 23, 0.7)'
      : 'rgba(240, 248, 255, 0.7)'};
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.scrolled 
    ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
    : 'none'};
  transition: all 0.3s ease;
  height: 80px;
  display: flex;
  align-items: center;
`;

const NavContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const LogoContainer = styled.div`
  z-index: 1001;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  
  svg {
    margin-right: 8px;
    font-size: 1.8rem;
    color: ${props => props.theme.primary};
  }
`;

const LogoText = styled.span`
  font-family: 'Fira Code', monospace;
  color: ${props => props.theme.text};
`;

const LogoAccent = styled.span`
  color: ${props => props.theme.primary};
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinksDesktop = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.li`
  margin: 0 1rem;
  
  a {
    display: flex;
    align-items: center;
    color: ${props => props.active ? props.theme.primary : props.theme.text};
    font-weight: ${props => props.active ? '600' : '400'};
    transition: color 0.3s ease;
    
    svg {
      margin-right: 6px;
    }
    
    &:hover {
      color: ${props => props.theme.primary};
    }
  }
`;

const ThemeToggleContainer = styled.div`
  margin-left: 1.5rem;
`;

const NavLinksMobile = styled.ul`
  display: none;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 6rem 2rem 2rem;
  background: ${props => props.theme.surface};
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  list-style: none;
  z-index: 1000;
  border-radius: 0 0 20px 20px;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavLinkMobile = styled.li`
  margin: 1rem 0;
  
  a {
    display: flex;
    align-items: center;
    color: ${props => props.theme.text};
    font-size: 1.2rem;
    
    svg {
      margin-right: 10px;
      font-size: 1.4rem;
    }
  }
`;

const ThemeToggleMobile = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

export default Navbar;