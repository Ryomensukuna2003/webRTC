import Dashboard from './components/Dashboard'
import UserContextProvider from './Context/userContextProvider'

export default function App() {
  return (
    <UserContextProvider>
      <Dashboard />
    </UserContextProvider>
  )
}