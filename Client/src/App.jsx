import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'


import Dashboard from './Pages/Dashboard'
import Main_page from './Pages/Main_page'

export default function App() {
  const url = localStorage.getItem("url");
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path={`/:${url}`} element={<Main_page />} />
    </Routes>
  )
}