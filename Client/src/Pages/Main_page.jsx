import React, { useEffect, useState, useCallback } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../Context/SocketContext';
import { usePeer } from '../Context/Peer';

const Main_page = () => {
  const socket = useSocket();
  const { peerId, connectToPeer, callPeer, remoteStream } = usePeer();
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomMessage, setRoomMessage] = useState('');
  const [otherUsers, setOtherUsers] = useState([]); 
  const [localStream, setLocalStream] = useState(null);
  const url = localStorage.getItem("url");

  useEffect(() => {
    if (socket && peerId) {
      socket.emit("join_room", { url, peerId });

      socket.on("room_joined", (data) => {
        setRoomJoined(true);
        setRoomMessage(data.message);
        setOtherUsers(data.users || []); 
      });

      socket.on("user_joined", (user) => {
        setOtherUsers(prev => [...prev, user]);
      });

      socket.on("user_left", (userId) => {
        setOtherUsers(prev => prev.filter(user => user.peerId !== userId));
      });

      socket.on("receive_peer_id", ({ fromPeerId }) => {
        connectToPeer(fromPeerId);
      });
    }

    return () => {
      if (socket) {
        socket.off("room_joined");
        socket.off("user_joined");
        socket.off("user_left");
        socket.off("receive_peer_id");
      }
    };
  }, [socket, peerId, connectToPeer]);

  const initiateCall = useCallback((remotePeerId) => {
    callPeer(remotePeerId);
  }, [callPeer]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => console.error('Failed to get local stream', err));
  }, []);

  return (
    <div className='grid justify-items-center w-screen'>
      <h1 className='mb-5'>Hello.. </h1>
      {roomJoined ? (
        <>
          <p className='text-3xl'>{roomMessage}</p>
          <h2>Other users in the room:</h2>
          {otherUsers.length > 0 ? (
            <ul>
              {otherUsers.map(user => (
                <li key={user.peerId}>
                  {user.peerId}
                  <button 
                    onClick={() => initiateCall(user.peerId)} 
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Call
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No other users in the room.</p>
          )}
          <div>
            <h3>My Stream</h3>
            {localStream && <ReactPlayer url={localStream} playing muted />}
          </div>
          {remoteStream && (
            <div>
              <h3>Remote Stream</h3>
              <ReactPlayer url={remoteStream} playing />
            </div>
          )}
        </>
      ) : (
        <p>Joining room...</p>
      )}
    </div>
  );
}

export default Main_page