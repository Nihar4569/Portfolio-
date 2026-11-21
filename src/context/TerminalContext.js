import React, { createContext, useState, useContext } from 'react';

const TerminalContext = createContext();

export const TerminalProvider = ({ children }) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [opening, setOpening] = useState(null);

  const openTerminal = (guide = 'scout', question = '') => {
    setOpening({ mode: 'chat', guide, question });
    setIsTerminalOpen(true);
  };
  const openShell = () => {
    setOpening({ mode: 'shell', guide: 'scout' });
    setIsTerminalOpen(true);
  };
  const closeTerminal = () => setIsTerminalOpen(false);

  return (
    <TerminalContext.Provider value={{ 
      isTerminalOpen, 
      opening,
      openTerminal, 
      openShell,
      closeTerminal
    }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};

export default TerminalContext;
