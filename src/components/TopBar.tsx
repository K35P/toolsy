import WindowsButtons from "./WindowsButtons"
import { desktopApi } from "../api/desktop"

export default function TopBar() {
  return (
    <div className="topbar" data-tauri-drag-region>
      <div className="flex no-drag">
        <WindowsButtons />
      </div>
    </div>
  )
}
