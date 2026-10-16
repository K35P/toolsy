import { invoke, isTauri } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { open } from '@tauri-apps/plugin-dialog'
import { openUrl } from '@tauri-apps/plugin-opener'
import type { ElectronAPI } from '../types/electron-api'

const tauriRuntime = isTauri()

const platform = (() => {
  const agent = navigator.userAgent.toLowerCase()
  if (agent.includes('windows')) return 'win32'
  if (agent.includes('macintosh') || agent.includes('mac os')) return 'darwin'
  return 'linux'
})()

function requireElectron(): ElectronAPI {
  if (!window.electronAPI) throw new Error('API desktop non disponibile in questo runtime')
  return window.electronAPI
}

export const desktopApi = {
  isAvailable: tauriRuntime || Boolean(window.electronAPI),
  isTauri: tauriRuntime,
  platform,
  async minimize() {
    if (tauriRuntime) return getCurrentWindow().minimize()
    return requireElectron().minimize()
  },
  async maximize() {
    if (tauriRuntime) return getCurrentWindow().toggleMaximize()
    return requireElectron().maximize()
  },
  async close() {
    if (tauriRuntime) return getCurrentWindow().close()
    return requireElectron().close()
  },
  async selectImage(): Promise<string | null> {
    if (!tauriRuntime) return requireElectron().selectImage()
    const selected = await open({ multiple: false, filters: [{ name: 'Immagini', extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff'] }] })
    return typeof selected === 'string' ? selected : null
  },
  async selectOutputFolder() {
    if (!tauriRuntime) return requireElectron().selectOutputFolder()
    const selected = await open({ directory: true, multiple: false, title: 'Seleziona cartella di output per le conversioni' })
    return { canceled: !selected, filePaths: typeof selected === 'string' ? [selected] : [] }
  },
  async ensureConversionsDir(): Promise<string> {
    return tauriRuntime ? invoke('ensure_conversions_dir') : requireElectron().ensureConversionsDir()
  },
  async convertImage(filePath: string, format: string, quality?: number): Promise<string> {
    return tauriRuntime
      ? invoke('convert_image', { inputPath: filePath, format, quality })
      : requireElectron().convertImage(filePath, format, quality)
  },
  async openPath(filePath: string) {
    if (tauriRuntime) return invoke<void>('open_path', { filePath })
    return requireElectron().openPath(filePath)
  },
  async getConvertedFiles() {
    if (!tauriRuntime) return requireElectron().getConvertedFiles()
    const files = await invoke<Array<{ name: string; path: string; size: number; modified: string; isDirectory: boolean }>>('list_converted_files')
    return files.map((file) => ({ ...file, modified: new Date(Number(file.modified)) }))
  },
  async openConvertedFile(filePath: string) {
    return tauriRuntime ? invoke<void>('open_converted_file', { filePath }) : requireElectron().openConvertedFile(filePath)
  },
  async deleteConvertedFile(filePath: string) {
    return tauriRuntime ? invoke<boolean>('delete_converted_file', { filePath }) : requireElectron().deleteConvertedFile(filePath)
  },
  async openConversionsFolder() {
    if (!tauriRuntime) return requireElectron().openConversionsFolder()
    return invoke<void>('open_conversions_folder')
  },
  async getSettings() {
    return tauriRuntime
      ? invoke<Awaited<ReturnType<ElectronAPI['getSettings']>>>('get_settings')
      : requireElectron().getSettings()
  },
  async updateSettings(newSettings: Record<string, unknown>) {
    if (!tauriRuntime) return requireElectron().updateSettings(newSettings)
    const current = await invoke<Record<string, unknown>>('get_settings')
    return invoke<boolean>('update_settings', { newSettings: { ...current, ...newSettings } })
  },
  async getCustomOutputPath() {
    return tauriRuntime ? invoke<string>('get_custom_output_path') : requireElectron().getCustomOutputPath()
  },
  async setCustomOutputPath(customPath: string) {
    return tauriRuntime ? invoke<boolean>('set_custom_output_path', { customPath }) : requireElectron().setCustomOutputPath(customPath)
  },
  async getSidePanelState() {
    return tauriRuntime ? invoke<boolean>('get_side_panel_state') : requireElectron().getSidePanelState()
  },
  async setSidePanelState(collapsed: boolean) {
    return tauriRuntime ? invoke<boolean>('set_side_panel_state', { collapsed }) : requireElectron().setSidePanelState(collapsed)
  },
  async openExternal(url: string) {
    const parsed = new URL(url)
    if (parsed.href !== 'https://github.com/K35P/toolsy') throw new Error('Indirizzo esterno non autorizzato')
    if (tauriRuntime) return openUrl(parsed.href)
    window.open(parsed.href, '_blank', 'noopener,noreferrer')
  },
}
