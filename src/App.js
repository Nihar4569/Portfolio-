import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { TerminalProvider } from './context/TerminalContext';
import { SoundProvider } from './context/SoundContext';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import BackgroundAnimation from './components/common/BackgroundAnimation';
import PageTransition from './components/common/PageTransition';
import ThemeToggleAnimation from './components/common/ThemeToggleAnimation';
import EnhancedAnimatedCursor from './components/common/EnhancedAnimatedCursor';
import SmartTerminal from './components/common/SmartTerminal';
import SoundToggle from './components/common/SoundToggle';


// Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import AlbumsPage from './pages/AlbumsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import './styles/globals.css';
import EnhancedTouchAnimation from './components/common/TouchAnimationEffect';
import TouchParticleEffect from './components/common/TouchAnimationEffect';

function App() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <SoundProvider>
          <ThemedApp />
        </SoundProvider>
      </TerminalProvider>
    </ThemeProvider>
  );
}

const ThemedApp = () => {
  const { theme, isAnimating } = useContext(ThemeContext);
  
  return (
    <StyledThemeProvider theme={theme}>
      <AppContainer>
        <EnhancedAnimatedCursor />
        <TouchParticleEffect />
        <Router>
          <ScrollToTop />
          <Navbar />
          <BackgroundAnimation />
          {isAnimating && <ThemeToggleAnimation />}
          <MainContent>
            <PageTransition>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/albums" element={<AlbumsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageTransition>
          </MainContent>
          <Footer />
          <SmartTerminal />
          <SoundToggle />
        </Router>
      </AppContainer>
    </StyledThemeProvider>
  );
};

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  transition: background-color 0.5s ease, color 0.5s ease;
  position: relative;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  position: relative;
  z-index: 1;
`;

export default App;