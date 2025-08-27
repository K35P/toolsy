import React from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalProvider } from "./context/GlobalContext";
import { BrowserRouter } from 'react-router';
import App from './App'

import './index.css'

import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
