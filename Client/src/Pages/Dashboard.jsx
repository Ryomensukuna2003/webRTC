import { React } from 'react';
import DynamicInput from '../components/ui/URLinput';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const redirect_to_url = () => {
    const url = localStorage.getItem("url") || 'neko';
    navigate(`/${url}`);
  };

  return (
    <div className='grid justify-items-center w-screen'>
      <DynamicInput />
      <Button onClick={redirect_to_url} className='mt-5'>Start Chat</Button>
    </div>
  );
};

export default Dashboard;
