import React, { useEffect, useState } from 'react'
import { useSocket } from '../Context/SocketContext';

const Main_page = () => {
  const socket = useSocket();
  const url =localStorage.getItem("url"); 
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomMessage, setRoomMessage] = useState('');
  console.log(localStorage.getItem("url"));
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
      <h1>Helloww.. {url}</h1>

    </div>
  );
}

export default Main_page