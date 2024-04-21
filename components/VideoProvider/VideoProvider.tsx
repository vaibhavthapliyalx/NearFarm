/**
 * @fileoverview This file contains the video provider component.
 * This component is used to render a slideshow of some farming related video clips
 * in the login and signup page.
 * 
 * Note: These videos are free to use and are from the website https://www.pexels.com/
 */

// Directive to use client side rendering.
'use client';

// Importing necessary libraries and components.
import { useState, useEffect, useRef } from 'react';

// Interface for the props that the VideoProvider component accepts.
interface IProps {
  className?: string;
}

/**
 * Renders the video provider component.
 * 
 * @param className The class name of the video provider component.
 * @returns The rendered video provider component.
 */
export default function VideoProvider({className}: IProps) {
  // State to store the random video.
  const [randomVideo, setRandomVideo] = useState('video1.mp4');
  // Reference to the video element.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Array of video file names.
  // These videos are stored in the assets directory.
  const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4'];

  /**
   * Handles the video end event.
   * When the video ends, a new random video is selected.
   */
  const handleVideoEnd = () => {
    selectRandomVideo((selectedVideo) => {
      if (videoRef.current) {
        const source = videoRef.current.getElementsByTagName('source')[0];
        source.src = `/assets/videos/farming/${selectedVideo}`;
        videoRef.current.load();
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
        };
      }
    });
  };

  /**
   * Selects a random video from the videos array.
   * 
   * @param callback The callback function to be called after selecting the video.
   */
  function selectRandomVideo(callback: (selectedVideo: string) => void) {
    if (videos.length === 1) {
      callback(videos[0]);
      return;
    }
    let selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    // If the selected video is the same as the current video, select a different video
    while (selectedVideo === randomVideo) {
      selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    }
    setRandomVideo(selectedVideo);
    callback(selectedVideo);
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [randomVideo]);
  
  /***************************** Render Function *****************/
  return (
    <video 
      ref={videoRef}
      className={className}
      preload='auto'
      autoPlay
      controls={false}
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