import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';

import { PlayList } from './PlayList';
import DisplayTrack from './DisplayTrack';
import Controls from './Controls';
import ProgressBar from './ProgressBar';

function AudioPlayer({ tracks } = { tracks: [] }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex]);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  const audioRef = useRef();
  const progressBarRef = useRef();
  const playAnimationRef = useRef();

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    if (trackIndex >= tracks.length - 1) {
      setTrackIndex(0);
      setCurrentTrack(tracks[0]);
    } else {
      setTrackIndex((prev) => prev + 1);
      setCurrentTrack(tracks[trackIndex + 1]);
    }
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    setDuration(seconds);
    if (progressBarRef.current) progressBarRef.current.max = seconds;
  };

  const repeat = useCallback(() => {
    const currentTime = audioRef.current?.currentTime;
    setTimeProgress(currentTime);
    if (progressBarRef.current) {
      progressBarRef.current.value = currentTime;
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(progressBarRef.current.value / duration) * 100}%`,
      );
    }

    if (playAnimationRef) playAnimationRef.current = requestAnimationFrame(repeat);
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    if (playAnimationRef) playAnimationRef.current = requestAnimationFrame(repeat);
  }, [isPlaying, audioRef, repeat]);

  const skipForward = () => {
    audioRef.current.currentTime += 15;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 15;
  };

  const handlePrevious = () => {
    if (trackIndex === 0) {
      const lastTrackIndex = tracks.length - 1;
      setTrackIndex(lastTrackIndex);
      setCurrentTrack(tracks[lastTrackIndex]);
    } else {
      setTrackIndex((prev) => prev - 1);
      setCurrentTrack(tracks[trackIndex - 1]);
    }
  };

  useEffect(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <div className="audio-player">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        src={currentTrack?.src}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="inner">
        <DisplayTrack
          {...{
            currentTrack,
          }}
        />
        <Controls
          {...{
            audioRef,
            progressBarRef,
            duration,
            setTimeProgress,
            tracks,
            trackIndex,
            setTrackIndex,
            setCurrentTrack,
            handleNext,
            isPlaying,
            muteVolume,
            volume,
            onClickMute: () => setMuteVolume((prev) => !prev),
            setVolume,
            togglePlayPause,
            handlePrevious,
            skipBackward,
            skipForward,
          }}
        />
        <ProgressBar
          {...{
            progressBarRef, audioRef, timeProgress, duration,
          }}
        />
        <PlayList
          tracks={tracks}
          onTrackClick={(idx) => {
            setTrackIndex(idx);
            setCurrentTrack(tracks[idx]);
          }}
          {...{
            audioRef,
            progressBarRef,
            duration,
            setTimeProgress,
            tracks,
            trackIndex,
            setTrackIndex,
            setCurrentTrack,
            handleNext,
            isPlaying,
            togglePlayPause,
          }}
        />
      </div>
    </div>
  );
}
export default AudioPlayer;
