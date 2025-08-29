import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { 
  LanguageIcon, 
  FolderIcon, 
  Cog6ToothIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import './Settings.css';

const Settings = () => {
  const { 
    language, 
    handleLanguageChange, 
    outputPath, 
    handleOutputPathChange 
  } = useGlobalContext();
  
  const [localOutputPath, setLocalOutputPath] = useState(outputPath);
  const [isPathValid, setIsPathValid] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Aggiorna il percorso locale quando cambia quello globale
  useEffect(() => {
    setLocalOutputPath(outputPath);
  }, [outputPath]);

  // Valida il percorso inserito
  const validatePath = (path: string) => {
    if (!path) return true; // Percorso vuoto è valido (userà quello di default)
    return path.length > 0 && !path.includes('?') && !path.includes('*');
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    setLocalOutputPath(newPath);
    setIsPathValid(validatePath(newPath));
  };

  const handlePathSave = () => {
    if (isPathValid) {
      handleOutputPathChange(localOutputPath);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const resetToDefault = () => {
    setLocalOutputPath('');
    setIsPathValid(true);
    handleOutputPathChange('');
  };

  const openFolderPicker = async () => {
    try {
      // Chiamata IPC per aprire il selettore di cartelle
      const result = await window.electronAPI.selectOutputFolder();
      if (result && result.canceled === false && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        setLocalOutputPath(selectedPath);
        setIsPathValid(true);
        handleOutputPathChange(selectedPath);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Errore nella selezione della cartella:', error);
    }
  };

  const languages = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="min-h-screen settings-container">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Cog6ToothIcon className="w-8 h-8 text-green-300" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Impostazioni
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Personalizza le impostazioni dell'applicazione secondo le tue preferenze
          </p>
        </div>

        {/* Messaggio di successo */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 success-message">
            <CheckIcon className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Impostazioni salvate con successo!</span>
          </div>
        )}

        <div className="grid gap-8">
          {/* Sezione Lingua */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <LanguageIcon className="w-6 h-6 text-green-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Lingua
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Scegli la lingua dell'interfaccia utente
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 language-grid">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-3 rounded-lg border transition-all duration-200 language-option ${
                    language === lang.code
                      ? 'border-green-300 bg-green-950/50 text-green-700 dark:text-blue-300'
                      : 'bg-white/5 hover:bg-white/10 broder border-0'
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-sm font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sezione Percorso di Output */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <FolderIcon className="w-6 h-6 text-green-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Percorso di Output
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Scegli dove salvare i file convertiti. Se non specificato, verrà utilizzata la cartella "Toolsy Conversions" sul desktop.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-3 path-input-container">
                <input
                  type="text"
                  value={localOutputPath}
                  onChange={handlePathChange}
                  placeholder="Percorso personalizzato (opzionale)"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isPathValid 
                      ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500' 
                      : 'border-red-300 dark:border-red-600 focus:border-red-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                />
                <button
                  onClick={openFolderPicker}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <FolderIcon className="w-5 h-5" />
                  Sfoglia
                </button>
              </div>

              {!isPathValid && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 error-message">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <span>Percorso non valido</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handlePathSave}
                  disabled={!isPathValid}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Salva Percorso
                </button>
                <button
                  onClick={resetToDefault}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Ripristina Default
                </button>
              </div>

              {outputPath && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Percorso attuale:</strong> {outputPath}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Informazioni aggiuntive */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <LightBulbIcon className="w-6 h-6 text-green-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Informazioni
              </h2>
            </div>
            <ul className="space-y-1 text-sm">
              <li>Le impostazioni vengono salvate automaticamente nell'app in locale</li>
              <li>Il percorso di output personalizzato verrà utilizzato per tutte le conversioni future</li>
              <li>Se non viene specificato un percorso, verrà utilizzata la cartella predefinita sul desktop</li>
              <li>La lingua selezionata si applicherà immediatamente all'interfaccia</li>
            </ul>
          </div>

          {/* Sezione Crediti */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 text-green-300 text-center font-bold">⚡</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Crediti
              </h2>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
              Toolsy è un’applicazione desktop gratuita creata per la community. Riunisce strumenti utili per la gestione quotidiana dei file, funzionando interamente in locale: nessuna pubblicità, nessun caricamento di dati su server sconosciuti, solo praticità e semplicità a disposizione di tutti.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Tecnologie utilizzate:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                  Electron
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                  React
                </span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium">
                  Vite
                </span>
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium">
                  Tailwind CSS
                </span>
              </div>
              <div className="pt-2">
                <a 
                  href="https://github.com/K35P/toolsy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-200 underline"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Visualizza su GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;