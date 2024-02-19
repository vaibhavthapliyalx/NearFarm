'use client';
import { useState, useEffect, useRef } from 'react';

interface IProps {
  className?: string;
}

export default function VideoProvider({className}: IProps) {
  const [randomVideo, setRandomVideo] = useState('video1.mp4');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4'];

  useEffect(() => {
    selectRandomVideo();
  }, []);

  const selectRandomVideo = () => {
    
    let selectedVideo = videos[Math.floor(Math.random() * videos.length)];

    // If the selected video is the same as the current video, select a different video
    while (selectedVideo === randomVideo) {
      selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    }

    setRandomVideo(selectedVideo);
  };

  const handleVideoEnd = () => {
    selectRandomVideo();
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <video 
      ref={videoRef}
      className={className}
      preload='auto'
      autoPlay  
      muted
      onEnded={handleVideoEnd}
      style={{
        position: "absolute",
        width: "100%",
        left: "50%",
        top: "50%",
        height: "100%",
        objectFit: "cover",
        transform: "translate(-50%, -50%)",
        zIndex: "1",
      }}
    >
      <source src={`/assets/videos/farming/${randomVideo}`} type="video/mp4" />
    </video>
  );
}