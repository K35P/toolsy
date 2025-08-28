import './css/App.css'
import SidePanel from './components/SidePanel/SidePanel'
import { Route, Routes } from 'react-router'
import TopBar from './components/TopBar'
import Home from './pages/Home/Home'
import MyFiles from './pages/MyFiles/MyFiles'
import Settings from './pages/Settings/Settings'

function App() {
  return (
    <div className='App'>
      <TopBar />

      <div className='main-content'>
        <SidePanel />

        <div className='content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/files" element={<MyFiles />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App
