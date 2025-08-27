import './css/App.css'
import SidePanel from './components/SidePanel/SidePanel'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <div className='App'>
      <nav className='topbar'></nav>
      <div className='main-content'>
        <SidePanel />

        <div className='content'>
          <Routes>
            <Route path="/" element={<span>Home</span>} />
            <Route path="/files" element={<span>My Files</span>} />
            <Route path="/settings" element={<span>Settings</span>} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App
