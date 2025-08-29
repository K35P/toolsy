import React, { useState, useEffect } from 'react';
import { 
  FolderIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import ConvertedFileItem from '../../components/ConvertedFileItem';
import { ConvertedFile, sortFiles } from '../../utils/fileManager';

const MyFiles: React.FC = () => {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const convertedFiles = await window.electronAPI.getConvertedFiles();
      setFiles(convertedFiles);
    } catch (err) {
      setError('Errore nel caricare i file convertiti');
      console.error('Errore nel caricare i file:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleOpenFile = async (filePath: string) => {
    try {
      await window.electronAPI.openConvertedFile(filePath);
    } catch (err) {
      console.error('Errore nell\'aprire il file:', err);
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo file?')) {
      try {
        const success = await window.electronAPI.deleteConvertedFile(filePath);
        if (success) {
          // Ricarica la lista dei file
          await loadFiles();
        }
      } catch (err) {
        console.error('Errore nell\'eliminare il file:', err);
      }
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = sortFiles(filteredFiles, sortBy, sortOrder);

  const openConversionsFolder = async () => {
    try {
      await window.electronAPI.openConversionsFolder();
    } catch (err) {
      console.error('Errore nell\'aprire la cartella:', err);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Caricamento file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">{error}</p>
          <button
            onClick={loadFiles}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">I Miei File</h1>
            <p className="text-gray-400">
              Cronologia dei file convertiti dalla cartella Toolsy Conversions
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={openConversionsFolder}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FolderIcon className="w-5 h-5" />
              <span>Apri Cartella</span>
            </button>
            
            <button
              onClick={loadFiles}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Aggiorna"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex w-full">
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <DocumentIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cerca file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400 whitespace-nowrap">Ordina per:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'modified')}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="modified">Data</option>
                <option value="name">Nome</option>
                <option value="size">Dimensione</option>
              </select>
            </div>
            
            <button
              onClick={toggleSortOrder}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors text-sm"
              title={`Ordina ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        {sortedFiles.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <div>
                <DocumentIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Nessun file trovato per "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-blue-400 hover:text-blue-300"
                >
                  Cancella ricerca
                </button>
              </div>
            ) : (
              <div>
                <FolderIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  Nessun file convertito trovato
                </p>
                <p className="text-gray-500">
                  I file convertiti appariranno qui dopo aver utilizzato i convertitori
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-400 mb-4">
              {sortedFiles.length} file trovato{sortedFiles.length !== 1 ? 'i' : ''}
              {searchTerm && ` per "${searchTerm}"`}
            </div>
            
            {sortedFiles.map((file, index) => (
              <ConvertedFileItem
                key={`${file.path}-${index}`}
                file={file}
                onOpen={handleOpenFile}
                onDelete={handleDeleteFile}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyFiles;