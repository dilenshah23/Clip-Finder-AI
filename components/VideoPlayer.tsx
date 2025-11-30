import React, { useRef, useEffect, useState } from 'react';
import { parseTimeStringToSeconds } from '../services/utils';

interface VideoPlayerProps {
  videoUrl: string;
  startTime?: string;
  endTime?: string;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, startTime, endTime, autoPlay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Convert time strings to seconds
  const startSeconds = startTime ? parseTimeStringToSeconds(startTime) : 0;
  const endSeconds = endTime ? parseTimeStringToSeconds(endTime) : null;

  useEffect(() => {
    if (videoRef.current) {
      // Seek to start time whenever startTime prop changes
      if (startTime) {
        videoRef.current.currentTime = startSeconds;
        if (autoPlay) {
          videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }
      }
    }
  }, [startTime, startSeconds, autoPlay]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);

      // Loop or stop if we pass the end time of the clip
      if (endSeconds && current >= endSeconds) {
        videoRef.current.pause();
        videoRef.current.currentTime = startSeconds;
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full max-h-[600px] object-contain mx-auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls={true}
      />

      {/* Custom Overlay for Clip Mode (Optional visual cue) */}
      {startTime && endTime && (
        <div className="absolute top-4 right-4 bg-brand-600/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium border border-brand-400/30">
          Viewing Clip Segment
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
