import React, { useContext, useEffect, useState } from 'react'
import { useSocket } from '../Context/SocketContext';
import UserContext from '../Context/userContext';

const Main_page = () => {
  const socket = useSocket();
  const { url } = useContext(UserContext);
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomMessage, setRoomMessage] = useState('');

  useEffect(() => {
    if (socket) {
      socket.emit("join_room", `${url}`);

      socket.on("room_joined", (data) => {
        setRoomJoined(true);
        setRoomMessage(data.message);
      });
      return () => {
        socket.off("room_joined");
      };
    }
  }, [socket, url]);

  return (
    <div className='grid justify-items-center w-screen'>
      {roomJoined ? (
        <p className='text-3xl'>{roomMessage}</p>
      ) : (
        <p>Joining room...</p>
      )}
      
    </div>
  );
}

export default Main_page