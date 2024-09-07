import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'

import UserContext from './Context/userContext'

import Dashboard from './Pages/Dashboard'
import Main_page from './Pages/Main_page'

export default function App() {
  const { url } = useContext(UserContext)
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path={`/${url}`} element={<Main_page />} />
    </Routes>
  )
}