export interface ElectronAPI {
  // OS Window: controls API
  platform: string;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  
  // ImageConverter: Image conversions API
  convertImage: (filePath: string, format: string, quality?: number) => Promise<string>;
  ensureConversionsDir: () => Promise<string>;
  selectImage: () => Promise<string | null>; // native dialog
  openPath: (folderPath: string) => Promise<string>;
  
  // MyFiles: File management API
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
  
  // Settings: Settings management API
  selectOutputFolder: () => Promise<any>;
  getCustomOutputPath: () => Promise<string | null>;
  setCustomOutputPath: (customPath: string) => Promise<boolean>;
  getSettings: () => Promise<any>;
  updateSettings: (newSettings: any) => Promise<boolean>;
  
  // Side Panel: Side panel state management API
  getSidePanelState: () => Promise<boolean>;
  setSidePanelState: (collapsed: boolean) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    ipcRenderer: import('electron').IpcRenderer;
  }
}
