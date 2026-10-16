import React from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalProvider } from "./context/GlobalContext";
import { BrowserRouter } from 'react-router';
import App from './App'

import './index.css'
import './css/_helper.css'
import { desktopApi } from './api/desktop'

// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

if (desktopApi.platform === 'win32') {
  document.body.classList.add('windows')
}
if (desktopApi.platform === 'darwin') {
  document.body.classList.add('macos')
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>,
)

if (!desktopApi.isTauri) {
  postMessage({ payload: 'removeLoading' }, '*')
}
