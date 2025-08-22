import './App.css'
import toolsyLogo from "./assets/toolsy-logo.svg"

function App() {
  return (
    <div className='App'>
      <nav className='navbar'></nav>
      <div className='main-content'>
        <aside className='side-panel'>
          <img src={toolsyLogo} alt="Toolsy Logo" style={{width: '100px'}} />
        </aside>
        <div className='content'>Contenuto principale</div>
      </div>
    </div>
  )
}

export default App
