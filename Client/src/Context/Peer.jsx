import React, { createContext, useContext, useRef, useCallback } from 'react';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
  const peerRef = useRef(new RTCPeerConnection());

  const createOffer = useCallback(async () => {
    try {
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }, []);

  const createAnswer = useCallback(async (offer) => {
    try {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  }, []);

  const setRemoteDescription = useCallback(async (answer) => {
    try {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error("Error setting remote description:", error);
      throw error;
    }
  }, []);

  const value = {
    peer: peerRef.current,
    createOffer,
    createAnswer,
    setRemoteDescription
  };

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
};