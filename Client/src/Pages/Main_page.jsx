import React, { useEffect, useState, useCallback } from 'react'
import { useSocket } from '../Context/SocketContext'
import { usePeer } from '../Context/Peer'
import Video from '../components/Video'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, PhoneOff, Video as VideoIcon, VideoOff } from "lucide-react"

const Main_page = () => {
  const socket = useSocket()
  const { peerId, connectToPeer, callPeer, remoteStream } = usePeer()
  const [roomJoined, setRoomJoined] = useState(false)
  const [roomMessage, setRoomMessage] = useState('')
  const [otherUsers, setOtherUsers] = useState([])
  const [localStream, setLocalStream] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const url = localStorage.getItem("url")

  useEffect(() => {
    if (socket && peerId) {
      socket.emit("join_room", { url, peerId })

      socket.on("room_joined", (data) => {
        setRoomJoined(true)
        setRoomMessage(data.message)
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
    }

    return () => {
      if (socket) {
        socket.off("room_joined")
        socket.off("user_joined")
        socket.off("user_left")
        socket.off("receive_peer_id")
      }
    }
  }, [socket, peerId, connectToPeer])

  const initiateCall = useCallback((remotePeerId) => {
    callPeer(remotePeerId)
  }, [callPeer])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream)
      })
      .catch((err) => console.error('Failed to get local stream', err))
  }, [])

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled)
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled)
      setIsVideoOff(!isVideoOff)
    }
  }

  const endCall = () => {
    // Implement call ending logic here
    console.log("Call ended")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 p-4">
      <Card className="w-full bg-white shadow-xl rounded-xl overflow-hidden">
        {roomJoined ? (
          <>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6 text-center">{roomMessage}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VideoContainer stream={localStream} label="You" muted={true} />
                <VideoContainer
                  stream={remoteStream}
                  label="Remote User"
                  muted={false}
                  placeholder="Waiting for other participant..."
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
              <Button variant="destructive" className="px-4 py-2" onClick={endCall}>
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
        ) : (
          <div className="p-8 text-center">
            <p className="text-xl font-semibold">Joining room...</p>
          </div>
        )}
      </Card>
    </div>
  )
}

const VideoContainer = ({ stream, label, muted, placeholder }) => (
  <div className="relative w-full bg-gray-800 rounded-lg overflow-hidden shadow-md flex items-center justify-center">
  {stream ? (
    <Video 
      stream={stream} 
      muted={muted} 
      className="w-full h-full object-cover" 
    />
  ) : (
    <div className="flex items-center justify-center w-full h-full text-white">
      {placeholder}
    </div>
  )}
  <div className="absolute bottom-3 left-3 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-medium">
    {label}
  </div>
</div>

)

const ControlButton = ({ onClick, active, icon, label }) => (
  <Button
    variant="outline"
    onClick={onClick}
    className={`flex items-center px-4 py-2 ${active ? 'bg-red-100 hover:bg-red-200 text-red-600' : 'hover:bg-gray-200'
      } transition-colors duration-200`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Button>
)


export default Main_page