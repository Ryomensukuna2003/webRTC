import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import SocketProvider from './Context/socketContextProvider'
import { PeerProvider } from './Context/Peer.jsx'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <PeerProvider>
          <App />
        </PeerProvider>
      </SocketProvider>
    </BrowserRouter>
  // </StrictMode>,
)
