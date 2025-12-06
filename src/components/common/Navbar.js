import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiX, FiCode, FiHome, FiFolder, FiMail, FiImage } from 'react-icons/fi';

const Navbar = () => {
  const { isDark, isAnimating } = useContext(ThemeContext);
  const { playClick, playNavigation } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavClick = () => {
    playNavigation();
    closeMenu(); // Close menu after clicking a link
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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        
        {/* Mobile: Theme toggle + Hamburger menu */}
        <MobileControls>
          <MobileThemeToggle>
            <ThemeToggle />
          </MobileThemeToggle>
          <MenuButton onClick={toggleMenu} aria-label="Toggle menu" className="menu-button">
            {isOpen ? <FiX /> : <FiMenu />}
          </MenuButton>
        </MobileControls>
        
        <NavLinksDesktop>
          <NavLink $active={location.pathname === '/'}>
            <Link to="/" onClick={handleNavClick}>
              <FiHome /> Home
            </Link>
          </NavLink>
          
          <NavLink $active={location.pathname === '/projects'}>
            <Link to="/projects" onClick={handleNavClick}>
              <FiFolder /> Projects
            </Link>
          </NavLink>
          
          <NavLink $active={location.pathname === '/contact'}>
            <Link to="/contact" onClick={handleNavClick}>
              <FiMail /> Contact
            </Link>
          </NavLink>
          <NavLink $active={location.pathname === '/albums'}>
            <Link to="/albums" onClick={handleNavClick}>
              <FiImage /> Albums
            </Link>
          </NavLink>
          
          <ThemeToggleContainer>
            <ThemeToggle />
          </ThemeToggleContainer>
        </NavLinksDesktop>
        
        {/* Mobile Menu Overlay */}
        <MobileMenuOverlay isOpen={isOpen} onClick={closeMenu} />
        
        <NavLinksMobile isOpen={isOpen} className="mobile-nav">
          <MobileMenuHeader>
            <MobileMenuTitle>Menu</MobileMenuTitle>
            <CloseButton onClick={closeMenu}>
              <FiX />
            </CloseButton>
          </MobileMenuHeader>
          
          <NavLinkMobile $active={location.pathname === '/'}>
            <Link to="/" onClick={handleNavClick}>
              <FiHome /> Home
            </Link>
          </NavLinkMobile>
          
          <NavLinkMobile $active={location.pathname === '/projects'}>
            <Link to="/projects" onClick={handleNavClick}>
              <FiFolder /> Projects
            </Link>
          </NavLinkMobile>
          
          <NavLinkMobile $active={location.pathname === '/contact'}>
            <Link to="/contact" onClick={handleNavClick}>
              <FiMail /> Contact
            </Link>
          </NavLinkMobile>
          
          <NavLinkMobile $active={location.pathname === '/albums'}>
            <Link to="/albums" onClick={handleNavClick}>
              <FiImage /> Albums
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
  z-index: ${props => props.isAnimating ? 900 : 1000};
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
  
  @media (max-width: 768px) {
    height: 70px;
  }
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
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
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

const MobileControls = styled.div`
  display: none;
  align-items: center;
  gap: 0.8rem;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileThemeToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
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
    color: ${props => props.$active ? props.theme.primary : props.theme.text};
    font-weight: ${props => props.$active ? '600' : '400'};
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

const MobileMenuOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 50000;
    opacity: ${props => props.isOpen ? 1 : 0};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
  }
`;

const NavLinksMobile = styled.ul`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    max-width: 85%;
    height: 100vh;
    padding: 0;
    background: ${props => props.theme.surface};
    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.2);
    list-style: none;
    z-index: 50001;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  margin-bottom: 1rem;
`;

const MobileMenuTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  font-weight: 600;
  margin: 0;
  
  &:after {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.background};
    color: ${props => props.theme.primary};
  }
`;

const NavLinkMobile = styled.li`
  margin: 0;
  
  a {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    color: ${props => props.$active ? props.theme.primary : props.theme.text};
    font-size: 1.1rem;
    font-weight: ${props => props.$active ? '600' : '400'};
    transition: all 0.3s ease;
    border-left: 3px solid ${props => props.$active ? props.theme.primary : 'transparent'};
    background: ${props => props.$active ? props.theme.background : 'transparent'};
    
    svg {
      margin-right: 12px;
      font-size: 1.3rem;
    }
    
    &:hover {
      background: ${props => props.theme.background};
      color: ${props => props.theme.primary};
      border-left-color: ${props => props.theme.primary};
    }
  }
`;

const ThemeToggleMobile = styled.div`
  margin-top: auto;
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: center;
`;

export default Navbar;