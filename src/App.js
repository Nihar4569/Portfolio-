import React, { lazy, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { TerminalProvider } from './context/TerminalContext';
import { SoundProvider, useSound } from './context/SoundContext';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { MotionConfig } from 'framer-motion';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageTransition from './components/common/PageTransition';
import SmartTerminal from './components/common/SmartTerminal';
import SoundToggle from './components/common/SoundToggle';

// Pages
import HomePage from './pages/HomePage';
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AlbumsPage = lazy(() => import('./pages/AlbumsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Styles
import './styles/globals.css';
import './styles/portfolio.css';

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
  const { theme } = useContext(ThemeContext);
  const { playSound, armSound } = useSound();

  function soundOnClick(event) {
    const control = event.target.closest?.('button, a[href], summary, [role="button"], [data-sound]');
    if (!control || control.matches(':disabled, [aria-disabled="true"], [data-sound="off"]')) return;

    if (control instanceof HTMLAnchorElement && control.origin === window.location.origin &&
        control.pathname !== window.location.pathname && !control.target && !control.hasAttribute('download') &&
        !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      armSound();
      return;
    }
    playSound(control.dataset.sound || 'click');
  }

  return (
    <StyledThemeProvider theme={theme}>
      <MotionConfig reducedMotion="user">
        <AppContainer onClickCapture={soundOnClick} onChangeCapture={(event) => {
          if (event.target instanceof HTMLSelectElement) playSound('click');
        }}>
          <svg className="portfolio-light-filters" width="0" height="0" aria-hidden="true" focusable="false">
            <filter id="portfolio-blue-light" colorInterpolationFilters="sRGB">
              {/* Shift green-dominant light while retaining the portrait's warm tones. */}
              <feColorMatrix in="SourceGraphic" result="greenLight" values="
                0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 5 0 0 -0.12" />
              <feColorMatrix in="SourceGraphic" result="blue" values="
                .92 0 0 0 0  0 .78 .12 0 0  0 .86 .24 0 0  0 0 0 1 0" />
              <feComposite in="blue" in2="greenLight" operator="in" result="blueLight" />
              <feComposite in="blueLight" in2="SourceGraphic" operator="over" />
            </filter>
          </svg>
          <Router>
            <Navbar />
            <MainContent>
              <PageTransition>
                {(location) => (
                  <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/albums" element={<AlbumsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                )}
              </PageTransition>
            </MainContent>
            <Footer />
            <SmartTerminal />
            <SoundToggle />
          </Router>
        </AppContainer>
      </MotionConfig>
    </StyledThemeProvider>
  );
};

// Styled Components
const AppContainer = styled.div`
  --portfolio-bg: ${props => props.theme.background};
  --portfolio-text: ${props => props.theme.text};
  --portfolio-muted: ${props => props.theme.textSecondary};
  --portfolio-accent: ${props => props.theme.primary};
  --portfolio-line: ${props => props.theme.borderColor};
  --portfolio-control-line: ${props => props.theme.inputBorder};
  --portfolio-surface: ${props => props.theme.cardBackground};
  --portfolio-panel: ${props => props.theme.surface};
  --portfolio-code: ${props => props.theme.codeBackground};
  --portfolio-input: ${props => props.theme.inputBackground};
  --portfolio-button-text: ${props => props.theme.buttonText};
  --portfolio-backdrop: ${props => props.theme.backdrop};
  --portfolio-portrait-glow: ${props => props.theme.portraitGlow};
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: clip;
`;

const MainContent = styled.main`
  flex: 1;
  min-height: 100vh;
  position: relative;
  z-index: 1;
`;

export default App;
