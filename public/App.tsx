import './App.css'
import SidePanel from './components/SidePanel/SidePanel'

function App() {
  return (
    <div className='App'>
      <nav className='topbar'></nav>
      <div className='main-content'>
        <SidePanel />
        <div className='content'>Contenuto principale</div>
      </div>
    </div>
  )
}

export default App
