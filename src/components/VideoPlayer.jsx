import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaCog, FaForward, FaBackward, FaClosedCaptioning, FaTimes } from 'react-icons/fa';

const VideoPlayer = ({ videoUrl, subtitles, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleVideoClick = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    setIsMuted(value === 0);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <FaTimes className="text-xl" />
      </button>

      {videoUrl ? (
        <video
          ref={videoRef}
          className="w-full h-full"
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
          src={videoUrl}
        >
          {subtitles?.map((subtitle) => (
            <track
              key={subtitle.language}
              kind="subtitles"
              src={subtitle.url}
              srcLang={subtitle.language}
              label={subtitle.label}
            />
          ))}
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <FaPlay className="text-6xl text-gray-600 mb-4 mx-auto" />
            <p className="text-xl text-gray-400">No video available</p>
            <p className="text-sm text-gray-500 mt-2">Video URL not provided</p>
          </div>
        </div>
      )}

      {/* Video Controls */}
      {videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4"
        >
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-white"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="text-2xl text-white hover:text-primary"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button
                onClick={() => videoRef.current.currentTime -= 10}
                className="text-white hover:text-primary"
              >
                <FaBackward />
              </button>

              <button
                onClick={() => videoRef.current.currentTime += 10}
                className="text-white hover:text-primary"
              >
                <FaForward />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-primary"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-primary">
                <FaClosedCaptioning />
              </button>
              <button className="text-white hover:text-primary">
                <FaCog />
              </button>
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-primary"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoPlayer;