import React, { useEffect, useState, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { useSocket } from '../Context/SocketContext'
import { usePeer } from '../Context/Peer'
import { VideoContainer } from '../components/Video'
import { ControlButton } from '../components/ui/ControlButton'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, PhoneOff, Video as VideoIcon, VideoOff } from "lucide-react"

const Main_page = () => {
  const socket = useSocket()
  const { peerId, connectToPeer, callPeer, remoteStream, endCall } = usePeer()
  const [otherUsers, setOtherUsers] = useState([])
  const [localStream, setLocalStream] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const url = localStorage.getItem("url")

  useEffect(() => {
    if (socket && peerId) {
      joinRoom();
    }
  }, [socket, peerId])

  const joinRoom = useCallback(() => {
    socket.emit("join_room", { url, peerId })

    socket.on("room_joined", (data) => {
      setOtherUsers(data.users || [])
    })

    socket.on("user_joined", (user) => {
      setOtherUsers(prev => [...prev, user])
    })

    socket.on("user_left", (userId) => {
      setOtherUsers(prev => prev.filter(user => user.peerId !== userId))
    })

    socket.on("receive_peer_id", ({ fromPeerId }) => {
      connectToPeer(fromPeerId)
    })
  }, [socket, peerId, url, connectToPeer])

  const handleEndCall = useCallback(() => {
    endCall();
    setOtherUsers([]);
  }, [endCall])


  const initiateCall = useCallback((remotePeerId) => {
    callPeer(remotePeerId)
  }, [callPeer])
  const constraints={
    video:true,
  }
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream)
      })
      .catch((err) => console.error('Failed to get local stream', err))
  }, [])

  const toggleMute = () => {
    if (localStream && remoteStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled)
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream && remoteStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled)
      setIsVideoOff(!isVideoOff)
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 p-4">
      <Card className="w-full bg-white shadow-xl rounded-xl overflow-hidden">
        <>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VideoContainer stream={localStream} label="You" muted={true} />
              <VideoContainer
                stream={remoteStream}
                label="Remote User"
                muted={false}
                placeholder={<QRCodeSVG value={`http://localhost:5173/${url}`} className='w-60 h-60 bg-white p-5' />}
              />
            </div>
          </div>
          <div className="flex justify-center space-x-6 p-6 bg-gray-50">
            <ControlButton
              onClick={toggleMute}
              active={isMuted}
              icon={isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              label={isMuted ? "Unmute" : "Mute"}
            />
            <ControlButton
              onClick={toggleVideo}
              active={isVideoOff}
              icon={isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
              label={isVideoOff ? "Start Video" : "Stop Video"}
            />
            <Button variant="destructive" className="px-4 py-2" onClick={handleEndCall}>
              <PhoneOff className="h-5 w-5 mr-2" />
              End Call
            </Button>
          </div>
          {otherUsers.length > 0 && (
            <div className="p-6 border-t">
              <h2 className="text-lg font-semibold mb-4">Other users in the room:</h2>
              <ul className="space-y-3">
                {otherUsers.map(user => (
                  <li key={user.peerId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">{user.peerId}</span>
                    <Button
                      onClick={() => initiateCall(user.peerId)}
                      variant="outline"
                      size="sm"
                    >
                      Call
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      </Card>
    </div>
  )
}

export default Main_page