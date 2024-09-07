import {React, useContext} from 'react'
import DynamicInput from './URLinput'
import { Button } from './ui/button'
import UserContext from '../Context/userContext'

const Dashboard = () => {
    const {url}= useContext(UserContext)
    const redirect_to_url = () => {
      window.location.href = `http://localhost:5173/${url}`;
    }
  return (
    <div className='grid justify-items-center w-screen'>
      <DynamicInput />
      <Button onClick={redirect_to_url} className='mt-5'>Start Chat</Button>
    </div>
  )
}

export default Dashboard