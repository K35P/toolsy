export interface AppSettings {
  language: string
  outputPath: string
  theme: string
  sidePanelCollapsed: boolean
}

export interface ConvertedFileInfo {
  name: string
  path: string
  size: number
  modified: Date
  isDirectory: boolean
}

export interface FolderPickerResult {
  canceled: boolean
  filePaths: string[]
}
