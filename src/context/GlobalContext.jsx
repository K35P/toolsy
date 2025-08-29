import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext(); // Provider

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isSidePanelClosed, setIsSidePanelClosed] = useState(false);
  const [language, setLanguage] = useState('it');
  const [outputPath, setOutputPath] = useState('');

  // Carica le impostazioni salvate all'avvio
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Prima prova a caricare dal processo principale
        if (window.electronAPI) {
          const settings = await window.electronAPI.getSettings();
          if (settings) {
            setLanguage(settings.language || 'it');
            setOutputPath(settings.outputPath || '');
            setIsSidePanelClosed(settings.sidePanelCollapsed || false);
            
            // Imposta la variabile CSS per la larghezza della sidebar
            document.documentElement.style.setProperty(
              '--side-panel-width',
              settings.sidePanelCollapsed ? '50px' : '200px'
            );
            return;
          }
        }
        
        // Fallback al localStorage
        const savedLanguage = localStorage.getItem('toolsy-language');
        const savedOutputPath = localStorage.getItem('toolsy-output-path');
        const savedSidePanelState = localStorage.getItem('toolsy-side-panel-collapsed');
        
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedOutputPath) setOutputPath(savedOutputPath);
        if (savedSidePanelState) {
          const isCollapsed = savedSidePanelState === 'true';
          setIsSidePanelClosed(isCollapsed);
          document.documentElement.style.setProperty(
            '--side-panel-width',
            isCollapsed ? '50px' : '200px'
          );
        }
      } catch (error) {
        console.error('Errore nel caricare le impostazioni:', error);
        
        // Fallback al localStorage
        const savedLanguage = localStorage.getItem('toolsy-language');
        const savedOutputPath = localStorage.getItem('toolsy-output-path');
        const savedSidePanelState = localStorage.getItem('toolsy-side-panel-collapsed');
        
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedOutputPath) setOutputPath(savedOutputPath);
        if (savedSidePanelState) {
          const isCollapsed = savedSidePanelState === 'true';
          setIsSidePanelClosed(isCollapsed);
          document.documentElement.style.setProperty(
            '--side-panel-width',
            isCollapsed ? '50px' : '200px'
          );
        }
      }
    };

    loadSettings();
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleSidePanel = async () => {
    setIsSidePanelClosed(prev => {
      const newValue = !prev;
      document.documentElement.style.setProperty(
        '--side-panel-width',
        newValue ? '50px' : '200px'
      );
      
      // Salva lo stato nel processo principale
      try {
        if (window.electronAPI) {
          window.electronAPI.setSidePanelState(newValue);
        }
      } catch (error) {
        console.error('Errore nel salvare lo stato della sidebar:', error);
        // Fallback al localStorage
        localStorage.setItem('toolsy-side-panel-collapsed', newValue.toString());
      }
      
      return newValue;
    });
  };

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('toolsy-language', newLanguage);
    
    // Sincronizza con il processo principale
    try {
      if (window.electronAPI) {
        await window.electronAPI.updateSettings({ language: newLanguage });
      }
    } catch (error) {
      console.error('Errore nell\'aggiornare la lingua nel processo principale:', error);
    }
  };

  const handleOutputPathChange = async (newPath) => {
    setOutputPath(newPath);
    localStorage.setItem('toolsy-output-path', newPath);
    
    // Sincronizza con il processo principale
    try {
      if (window.electronAPI) {
        await window.electronAPI.setCustomOutputPath(newPath);
      }
    } catch (error) {
      console.error('Errore nell\'aggiornare il percorso nel processo principale:', error);
    }
  };

  const values = {
    theme,
    handleToggleTheme,
    isSidePanelClosed,
    handleToggleSidePanel,
    language,
    handleLanguageChange,
    outputPath,
    handleOutputPathChange,
  };

  return (
    <GlobalContext.Provider value={values}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
