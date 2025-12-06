import React, { createContext, useState, useContext } from 'react';

const TerminalContext = createContext();

export const TerminalProvider = ({ children }) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const openTerminal = () => setIsTerminalOpen(true);
  const closeTerminal = () => setIsTerminalOpen(false);
  const toggleTerminal = () => setIsTerminalOpen(prev => !prev);

  return (
    <TerminalContext.Provider value={{ 
      isTerminalOpen, 
      openTerminal, 
      closeTerminal, 
      toggleTerminal,
      setIsTerminalOpen
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
