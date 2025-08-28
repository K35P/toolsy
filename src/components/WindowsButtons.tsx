export default function WindowsButtons() {
  const isWindows = window.api.platform === "win32"

  if (!isWindows) return null

  return (
    <div className="absolute top-0 right-0 h-8 flex items-center z-[9999] no-drag">
      {/* Minimize */}
      <button
        onClick={() => window.api.minimize()}
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none global-hover-bg text-white"
      >
        &#8211;
      </button>

      {/* Maximize */}
      <button
        onClick={() => window.api.maximize()}
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none global-hover-bg text-white"
      >
        ☐
      </button>

      {/* Close */}
      <button
        onClick={() => window.api.close()}
        className="w-12 h-7 flex items-center justify-center bg-transparent border-none rounded-none hover:bg-red-600/80 text-white"
      >
        ✕
      </button>
    </div>
  )
}
