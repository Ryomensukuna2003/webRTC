import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './Context/userContextProvider.jsx'
import SocketProvider from './Context/socketContextProvider'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
