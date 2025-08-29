import React from 'react';
import { 
  DocumentIcon, 
  FolderIcon, 
  EyeIcon, 
  TrashIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';
import { ConvertedFile, formatFileSize, formatDate, getFileIcon, getFileTypeColor } from '../utils/fileManager';

interface ConvertedFileItemProps {
  file: ConvertedFile;
  onOpen: (filePath: string) => void;
  onDelete: (filePath: string) => void;
}

const ConvertedFileItem: React.FC<ConvertedFileItemProps> = ({ file, onOpen, onDelete }) => {
  const fileType = getFileIcon(file.name, file.isDirectory);
  const iconColor = getFileTypeColor(fileType);

  const getFileIconComponent = (fileType: string) => {
    switch (fileType) {
      case 'folder':
        return <FolderIcon className={`w-8 h-8 ${iconColor}`} />;
      case 'image':
        return <PhotoIcon className={`w-8 h-8 ${iconColor}`} />;
      case 'video':
        return <VideoCameraIcon className={`w-8 h-8 ${iconColor}`} />;
      case 'document':
        return <DocumentTextIcon className={`w-8 h-8 ${iconColor}`} />;
      case 'audio':
        return <MusicalNoteIcon className={`w-8 h-8 ${iconColor}`} />;
      default:
        return <DocumentIcon className={`w-8 h-8 ${iconColor}`} />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {getFileIconComponent(fileType)}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate" title={file.name}>
              {file.name}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(file.modified)}</span>
              </div>
              
              {!file.isDirectory && (
                <span>{formatFileSize(file.size)}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpen(file.path)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Apri file"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onDelete(file.path)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Elimina file"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertedFileItem;
