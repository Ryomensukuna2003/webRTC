import React, { useEffect, useState, useCallback } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../Context/SocketContext';
import { usePeer } from '../Context/Peer';

const Main_page = () => {
  const socket = useSocket();
  const [myStream,setMystream]=useState(null); 
  const { createOffer, createAnswer, setRemoteDescription } = usePeer();
  const url = localStorage.getItem("url");
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomMessage, setRoomMessage] = useState('');
  const [otherUsers, setOtherUsers] = useState([]);

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      setMystream(stream); 
    } catch (error) {
      console.error('Failed to get user media stream:', error);
    }
  }, [])

  useEffect(() => {
    getUserMediaStream();
  })

  const handleNewUserJoined = useCallback(async (userId) => {
    if (userId !== socket.id) {
      setOtherUsers(prev => [...prev, userId]);
      const offer = await createOffer();
      console.log("offer -> " + offer);
      socket.emit("call-user", { userId, offer });
    }
  }, [socket, createOffer]);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    const answer = await createAnswer(offer);
    console.log("ans -> " + answer);
    socket.emit("call-accepted", { userId: from, answer });
  }, [socket, createAnswer]);

  const handleCallAccepted = useCallback(({ answer }) => {
    setRemoteDescription(answer);
  }, [setRemoteDescription]);

  useEffect(() => {
    if (socket) {
      socket.emit("join_room", url);

      socket.on("room_joined", (data) => {
        setRoomJoined(true);
        setRoomMessage(data.message);
      });

      socket.on("user_joined", handleNewUserJoined);

      socket.on("user_left", (userId) => {
        setOtherUsers(prev => prev.filter(id => id !== userId));
      });

      socket.on("incoming-call", handleIncomingCall);

      socket.on("call-accepted", handleCallAccepted);

      return () => {
        socket.off("room_joined");
        socket.off("user_joined");
        socket.off("user_left");
        socket.off("incoming-call");
        socket.off("call-accepted");
      };
    }
  }, [socket, url, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  return (
    <div className='grid justify-items-center w-screen'>
      <h1 className='mb-5'>Helloww.. </h1>
      {roomJoined ? (
        <>
          <p className='text-3xl'>{roomMessage}</p>
          <h2>Other users in the room:</h2>
          <ul>
            {otherUsers.map(userId => (
              <li key={userId}>{userId}</li>
            ))}
          </ul>
          <ReactPlayer url={myStream} playing/>
        </>
      ) : (
        <p>Joining room...</p>
      )}
    </div>
  );
}

export default Main_page