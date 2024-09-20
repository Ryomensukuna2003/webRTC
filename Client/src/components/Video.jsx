import ReactPlayer from 'react-player'

const Video = ({ stream, muted }) => {
  return (
    <div>
      {muted && <ReactPlayer url={stream} playing muted />}
      {!muted && <ReactPlayer url={stream} playing />}
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


export { VideoContainer }