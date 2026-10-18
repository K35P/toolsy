import { desktopApi } from "../api/desktop"

export default function WindowsButtons() {
  const hasCustomWindowControls = desktopApi.platform !== "darwin"

  if (!hasCustomWindowControls) return null

  return (
    <div className="absolute top-0 right-0 h-8 flex items-center z-[9999]">
      {/* Minimize */}
      <button
        onClick={() => desktopApi.minimize()}
        aria-label="Minimizza finestra"
        title="Minimizza"
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none global-hover-bg text-white"
      >
        &#8211;
      </button>

      {/* Maximize */}
      <button
        onClick={() => desktopApi.maximize()}
        aria-label="Massimizza o ripristina finestra"
        title="Massimizza o ripristina"
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none global-hover-bg text-white"
      >
        ☐
      </button>

      {/* Close */}
      <button
        onClick={() => desktopApi.close()}
        aria-label="Chiudi finestra"
        title="Chiudi"
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none hover:bg-red-600/80 text-white"
      >
        ✕
      </button>
    </div>
  )
}
