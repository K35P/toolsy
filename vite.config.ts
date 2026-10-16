import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

export default defineConfig(({ command, mode }) => {
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const isTauri = mode === 'tauri' || Boolean(process.env.TAURI_ENV_PLATFORM)
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  if (!isTauri) rmSync('dist-electron', { recursive: true, force: true })

  return {
    define: {
      __TOOLSY_TAURI_BUILD__: JSON.stringify(isTauri),
    },
    resolve: {
      alias: { '@': path.join(__dirname, 'src') },
    },
    plugins: [
      react(),
      ...(!isTauri ? [electron({
        main: {
          entry: 'electron/main/index.ts',
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log('[startup] Electron App')
            } else {
              args.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        preload: {
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined,
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        renderer: {},
      })] : []),
    ],
    server: isTauri
      ? { host: '127.0.0.1', port: 1420, strictPort: true }
      : process.env.VSCODE_DEBUG
        ? (() => {
          const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
          return { host: url.hostname, port: +url.port }
        })()
        : undefined,
    clearScreen: false,
  }
})
