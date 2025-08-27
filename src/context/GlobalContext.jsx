import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext(); // Provider

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isSidePanelClosed, setIsSidePanelClosed] = useState(false);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleSidePanel = () => {
    setIsSidePanelClosed(prev => {
      const newValue = !prev;
      document.documentElement.style.setProperty(
        '--side-panel-width',
        newValue ? '50px' : '200px'
      );
      return newValue;
    });
  };

  const values = {
    theme,
    handleToggleTheme,
    isSidePanelClosed,
    handleToggleSidePanel,
  };

  return (
    <GlobalContext.Provider value={values}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
