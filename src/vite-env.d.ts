/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI: {
    
    // OS Window: controls API
    platform: string
    minimize: () => void
    maximize: () => void
    close: () => void

    // ImageConverter: conversions API
    convertImage: (filePath: string, format: string, quality?: number) => Promise<string>;
    ensureConversionsDir: () => Promise<string>;
    selectImage: () => Promise<string | null>; // native dialog
    openPath: (folderPath: string) => Promise<string>;

    // MyFiles: files management API
    getConvertedFiles: () => Promise<Array<{
      name: string;
      path: string;
      size: number;
      modified: Date;
      isDirectory: boolean;
    }>>;
    openConvertedFile: (filePath: string) => Promise<string>;
    deleteConvertedFile: (filePath: string) => Promise<boolean>;
    openConversionsFolder: () => Promise<string>;
  },
}
