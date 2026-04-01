import React from 'react'
import { getYoutubeEmbedUrl } from '../utils/youtubeUtils'

const VideoPlayer = ({ url }) => {
  const embedUrl = getYoutubeEmbedUrl(url)

  if (!embedUrl) {
    return <div className="alert-error">رابط الفيديو غير صالح</div>
  }

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
      <iframe
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        src={embedUrl}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation allow-fullscreen"
      ></iframe>
    </div>
  )
}

export default VideoPlayer
