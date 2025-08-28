/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer,
  api: {
    platform: string
    minimize: () => void
    maximize: () => void
    close: () => void
  },

  // API preload for ImageConverter
  electronAPI: {
    convertImage: (filePath: string, format: string, quality?: number) => Promise<string>;
    ensureConversionsDir: () => Promise<string>;
    selectImage: () => Promise<string | null>; // dialog nativo
    openPath: (folderPath: string) => Promise<string>;
    handleDroppedFile: (filePath: string) => void;
  };
}
