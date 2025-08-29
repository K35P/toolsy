import WindowsButtons from "./WindowsButtons"

export default function TopBar() {
  const isWindows = window.electronAPI.platform === "win32"

  return (
    <div className="topbar">
      {isWindows && (
        <div className="flex no-drag">
          <WindowsButtons />
        </div>
      )}
    </div>
  )
}
