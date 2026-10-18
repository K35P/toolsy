import WindowsButtons from "./WindowsButtons"

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-drag-region" data-tauri-drag-region />
      <div className="flex">
        <WindowsButtons />
      </div>
    </div>
  )
}
