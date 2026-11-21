import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiX, FiCode, FiHome, FiFolder, FiMail, FiImage } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen((open) => !open);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavClick = () => {
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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
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
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const desktop = window.matchMedia('(min-width: 769px)');
    function closeOnDesktop(event) {
      if (event.matches) setIsOpen(false);
    }
    document.body.style.overflow = 'hidden';
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <NavbarContainer $scrolled={scrolled}>
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
          <MenuButton type="button" onClick={toggleMenu} aria-expanded={isOpen}
            aria-controls="portfolio-mobile-menu" aria-label="Toggle menu" className="menu-button">
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
        <MobileMenuOverlay $isOpen={isOpen} onClick={closeMenu} />
        
        <NavLinksMobile id="portfolio-mobile-menu" $isOpen={isOpen} className="mobile-nav">
          <MobileMenuHeader>
            <MobileMenuTitle>Menu</MobileMenuTitle>
            <CloseButton type="button" onClick={closeMenu} aria-label="Close menu">
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
  z-index: 1000;
  background: ${props => props.theme.navBackground};
  border-bottom: 1px solid ${props => props.$scrolled ? props.theme.borderColor : 'transparent'};
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.$scrolled
    ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
    : 'none'};
  transition: all 0.3s ease;
  min-height: var(--portfolio-header-height);
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

  @media (min-width: 1200px) {
    max-width: 82.5rem;
    padding-inline: 2.2rem;
  }
  
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

  @media (min-width: 1200px) {
    font-size: 1.65rem;
    svg { font-size: 1.98rem; margin-right: 0.55rem; }
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

  @media (min-width: 1200px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.li`
  margin: 0 1em;
  
  a {
    display: flex;
    align-items: center;
    color: ${props => props.$active ? props.theme.primary : props.theme.text};
    font-weight: ${props => props.$active ? '600' : '400'};
    transition: color 0.3s ease;
    
    svg {
      margin-right: 0.375em;
    }
    
    &:hover {
      color: ${props => props.theme.primary};
    }
  }
`;

const ThemeToggleContainer = styled.div`
  margin-left: 1.5em;
`;

const MobileMenuOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 50000;
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
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
    height: 100dvh;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) 0;
    background: ${props => props.theme.surface};
    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.2);
    list-style: none;
    z-index: 50001;
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
    @media (prefers-reduced-motion: no-preference) {
      transition: transform 0.25s ease;
    }
    overflow-y: auto;
    overscroll-behavior: contain;
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
