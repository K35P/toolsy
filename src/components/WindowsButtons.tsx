import { desktopApi } from "../api/desktop"

export default function WindowsButtons() {
  const isWindows = desktopApi.platform === "win32"
  const isMacTauri = desktopApi.platform === "darwin" && desktopApi.isTauri

  if (!isWindows && !isMacTauri) return null

  if (isMacTauri) {
    return (
      <div className="flex items-center gap-2 px-1" aria-label="Controlli finestra">
        <button aria-label="Chiudi finestra" title="Chiudi" onClick={() => desktopApi.close()} className="h-3 w-3 rounded-full border border-black/20 bg-[#ff5f57]" />
        <button aria-label="Minimizza finestra" title="Minimizza" onClick={() => desktopApi.minimize()} className="h-3 w-3 rounded-full border border-black/20 bg-[#febc2e]" />
        <button aria-label="Ingrandisci finestra" title="Ingrandisci" onClick={() => desktopApi.maximize()} className="h-3 w-3 rounded-full border border-black/20 bg-[#28c840]" />
      </div>
    )
  }

  return (
    <div className="absolute top-0 right-0 h-8 flex items-center z-[9999] no-drag">
      {/* Minimize */}
      <button
        onClick={() => desktopApi.minimize()}
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none global-hover-bg text-white"
      >
        &#8211;
      </button>

      {/* Maximize */}
      <button
        onClick={() => desktopApi.maximize()}
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none global-hover-bg text-white"
      >
        ☐
      </button>

      {/* Close */}
      <button
        onClick={() => desktopApi.close()}
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none hover:bg-red-600/80 text-white"
      >
        ✕
      </button>
    </div>
  )
}
