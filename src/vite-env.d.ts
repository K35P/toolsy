/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI: {
    // Window controls API
    platform: string
    minimize: () => void
    maximize: () => void
    close: () => void
    // Image conversions API
    convertImage: (filePath: string, format: string, quality?: number) => Promise<string>;
    ensureConversionsDir: () => Promise<string>;
    selectImage: () => Promise<string | null>; // native dialog
    openPath: (folderPath: string) => Promise<string>;
  },
}
