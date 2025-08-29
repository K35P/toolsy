export interface ConvertedFile {
  name: string;
  path: string;
  size: number;
  modified: Date;
  isDirectory: boolean;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getFileIcon = (fileName: string, isDirectory: boolean) => {
  if (isDirectory) return 'folder';
  
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
    case 'avif':
      return 'image';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
    case 'webm':
      return 'video';
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
    case 'rtf':
      return 'document';
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return 'audio';
    default:
      return 'file';
  }
};

export const getFileTypeColor = (fileType: string): string => {
  switch (fileType) {
    case 'image':
      return 'text-green-500';
    case 'video':
      return 'text-purple-500';
    case 'document':
      return 'text-red-500';
    case 'audio':
      return 'text-yellow-500';
    case 'folder':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

export const sortFiles = (files: ConvertedFile[], sortBy: 'name' | 'size' | 'modified' = 'modified', order: 'asc' | 'desc' = 'desc'): ConvertedFile[] => {
  const sortedFiles = [...files];
  
  sortedFiles.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'modified':
        comparison = a.modified.getTime() - b.modified.getTime();
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sortedFiles;
};
