/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer,
  api: {
    platform: string
    minimize: () => void
    maximize: () => void
    close: () => void
  }
}
