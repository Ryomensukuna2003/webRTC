import React from 'react'
import ReactPlayer from 'react-player'

const Video = ({ stream, muted }) => {
  return (
    <div>
      {muted && <ReactPlayer url={stream} playing muted  />}
      {!muted && <ReactPlayer url={stream} playing  />}

    </div>
  )
}

export default Video
