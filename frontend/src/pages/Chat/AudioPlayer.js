import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import './AudioPlayer.css';

const AudioPlayer = ({ sources, title = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Volume: 0 to 1
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.unload(); // Clean up Howl instance
    }
    const audio = new Howl({
      src: sources,
      format: ['webm', 'mp3', 'wav'],
      volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(audio.duration());
      },
      onpause: () => setIsPlaying(false),
      onstop: () => {
        setIsPlaying(false);
        setProgress(0);
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
      },
    });

    audioRef.current = audio;

    const updateProgress = setInterval(() => {
      if (audio.playing()) {
        setProgress(audio.seek());
      }
    }, 500);

    return () => {
      clearInterval(updateProgress);
      audio.unload();
    };
  }, [sources]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    // Update volume without affecting playback state
    if (audioRef.current) {
      audioRef.current.volume(newVolume);
    }
  };

  return (
    <div className="audio-player">
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${(progress / duration) * 100}%` }}
        ></div>
      </div>
      <div className="controls">
        <button className="play-pause-btn" onClick={togglePlay}>
          {isPlaying ? (
            <span className="icon pause-icon">||</span>
          ) : (
            <span className="icon play-icon">▶</span>
          )}
        </button>
        <span className="time">
          {formatTime(progress)} / {formatTime(duration)}
        </span>

        <input
          type="range"
          className="volume-control"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <span className="title">{title}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
