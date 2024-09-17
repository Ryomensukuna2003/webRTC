import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Context/SocketContext'

import Peer from 'peerjs';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
  const socket = useSocket()
  const navigate = useNavigate();
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    const newPeer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ]
      }
    });

    newPeer.on('open', (id) => {
      console.log('My peer ID -> ' + id);
      setPeerId(id);
    });

    newPeer.on('error', (error) => {
      console.error('PeerJS error:', error);
    });

    setPeer(newPeer);

    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, []);

  const connectToPeer = useCallback((remotePeerId) => {
    if (peer) {
      const conn = peer.connect(remotePeerId);
      setConnection(conn);

      conn.on('open', () => {
        console.log('Connected to peer:', remotePeerId);
      });

      conn.on('data', (data) => {
        console.log('Received data:', data);
      });
    }
  }, [peer]);

  const sendData = useCallback((data) => {
    if (connection) {
      connection.send(data);
    }
  }, [connection]);

  const callPeer = useCallback((remotePeerId) => {
    if (peer) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const call = peer.call(remotePeerId, stream);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        })
        .catch((err) => console.error('Failed to get local stream', err));
    }
  }, [peer]);

  const endCall=()=>{
    peer.destroy();
    socket.disconnect();
    navigate(`/`);
    console.log("user left")
  }

  useEffect(() => {
    if (peer) {
      peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            call.answer(stream);
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream);
            });
          })
          .catch((err) => console.error('Failed to get local stream', err));
      });
    }
  }, [peer]);
  

  const value = {
    peer,
    peerId,
    connectToPeer,
    sendData,
    callPeer,
    remoteStream,
    endCall
  };

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
};