import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'
import fs from "fs"
import { convertImage } from '../../utils/imageConverter'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')
const isWindows = process.platform === 'win32'

async function createWindow() {
  win = new BrowserWindow({
    title: 'Toolsy',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    frame: false, // Window without frame
    titleBarStyle: 'hiddenInset', // Hide the title bar but keeps the controls
    transparent: !isWindows,
    backgroundColor: isWindows ? '#1c1c1cCC' : '#00000000',
    vibrancy: isWindows ? undefined : 'under-window',
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false, // Important for security
      backgroundThrottling: false, // Prevents the throttling with transparent windows
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// For windows buttons
ipcMain.on('window:minimize', () => {
  win?.minimize()
})
ipcMain.on('window:maximize', () => {
  if (win?.isMaximized()) {
    win.unmaximize()
  } else {
    win?.maximize()
  }
})
ipcMain.on('window:close', () => {
  win?.close()
})

// Conversions modules
ipcMain.handle("ensure-conversions-dir", async () => {
  try {
    // pick the current user's desktop
    const desktopDir = app.getPath("desktop");
    const dir = path.join(desktopDir, "Toolsy Conversions");

    // create the folder if not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return dir;
  } catch (err) {
    console.error("Errore creando la cartella Toolsy Conversions:", err);
    throw err;
  }
});

ipcMain.handle("convert-image", async (_, inputPath: string, format: string, quality?: number) => {
  if (!inputPath) throw new Error("Percorso file non valido");

  const desktopDir = app.getPath("desktop");
  const outputDir = path.join(desktopDir, "Toolsy Conversions");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  return await convertImage(inputPath, outputDir, { format: format as any, quality });
});

ipcMain.handle("select-image", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      { name: "Images", extensions: ["jpg", "jpeg", "png", "webp", "avif", "tiff", "svg"] },
    ],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0]; // percorso assoluto
});

ipcMain.handle("open-path", async (_, filePath: string) => {
  const folder = path.dirname(filePath);
  return shell.openPath(folder);
});