import React, { createContext, useContext, useState } from 'react';

// Creazione del contesto
const GlobalContext = createContext();

// Provider
export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isSidePanelClosed, setIsSidePanelClosed] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const values = {
    theme,
    toggleTheme,
    isSidePanelClosed,
    setIsSidePanelClosed,
  };

  return (
    <GlobalContext.Provider value={values}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
