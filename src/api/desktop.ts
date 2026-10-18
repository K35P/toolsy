import { invoke, isTauri } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { open } from '@tauri-apps/plugin-dialog'
import { openUrl } from '@tauri-apps/plugin-opener'
import type { AppSettings, ConvertedFileInfo, FolderPickerResult } from '../types/desktop-api'

const tauriRuntime = isTauri()

const platform = (() => {
  const agent = navigator.userAgent.toLowerCase()
  if (agent.includes('windows')) return 'win32'
  if (agent.includes('macintosh') || agent.includes('mac os')) return 'darwin'
  return 'linux'
})()

function ensureDesktopRuntime() {
  if (!tauriRuntime) {
    throw new Error('Desktop API is only available inside the Toolsy Tauri app')
  }
}

export const desktopApi = {
  isAvailable: tauriRuntime,
  isTauri: tauriRuntime,
  platform,

  async minimize() {
    ensureDesktopRuntime()
    return getCurrentWindow().minimize()
  },

  async maximize() {
    ensureDesktopRuntime()
    return getCurrentWindow().toggleMaximize()
  },

  async close() {
    ensureDesktopRuntime()
    return getCurrentWindow().close()
  },

  async selectImage(): Promise<string | null> {
    ensureDesktopRuntime()
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Images',
        extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'svg'],
      }],
    })
    return typeof selected === 'string' ? selected : null
  },

  async selectOutputFolder(): Promise<FolderPickerResult> {
    ensureDesktopRuntime()
    const selected = await open({
      directory: true,
      multiple: false,
      title: 'Select output folder for conversions',
    })
    return {
      canceled: !selected,
      filePaths: typeof selected === 'string' ? [selected] : [],
    }
  },

  async ensureConversionsDir(): Promise<string> {
    ensureDesktopRuntime()
    return invoke('ensure_conversions_dir')
  },

  async convertImage(filePath: string, format: string, quality?: number): Promise<string> {
    ensureDesktopRuntime()
    return invoke('convert_image', { inputPath: filePath, format, quality })
  },

  async openPath(filePath: string) {
    ensureDesktopRuntime()
    return invoke<void>('open_path', { filePath })
  },

  async getConvertedFiles(): Promise<ConvertedFileInfo[]> {
    ensureDesktopRuntime()
    const files = await invoke<Array<{
      name: string
      path: string
      size: number
      modified: string
      isDirectory: boolean
    }>>('list_converted_files')
    return files.map((file) => ({ ...file, modified: new Date(Number(file.modified)) }))
  },

  async openConvertedFile(filePath: string) {
    ensureDesktopRuntime()
    return invoke<void>('open_converted_file', { filePath })
  },

  async deleteConvertedFile(filePath: string) {
    ensureDesktopRuntime()
    return invoke<boolean>('delete_converted_file', { filePath })
  },

  async openConversionsFolder() {
    ensureDesktopRuntime()
    return invoke<void>('open_conversions_folder')
  },

  async getSettings(): Promise<AppSettings> {
    ensureDesktopRuntime()
    return invoke<AppSettings>('get_settings')
  },

  async updateSettings(newSettings: Partial<AppSettings>) {
    ensureDesktopRuntime()
    const current = await invoke<AppSettings>('get_settings')
    return invoke<boolean>('update_settings', { newSettings: { ...current, ...newSettings } })
  },

  async getCustomOutputPath() {
    ensureDesktopRuntime()
    return invoke<string>('get_custom_output_path')
  },

  async setCustomOutputPath(customPath: string) {
    ensureDesktopRuntime()
    return invoke<boolean>('set_custom_output_path', { customPath })
  },

  async getSidePanelState() {
    ensureDesktopRuntime()
    return invoke<boolean>('get_side_panel_state')
  },

  async setSidePanelState(collapsed: boolean) {
    ensureDesktopRuntime()
    return invoke<boolean>('set_side_panel_state', { collapsed })
  },

  async openExternal(url: string) {
    ensureDesktopRuntime()
    const parsed = new URL(url)
    if (parsed.href !== 'https://github.com/K35P/toolsy') {
      throw new Error('External URL is not allowed')
    }
    return openUrl(parsed.href)
  },
}
