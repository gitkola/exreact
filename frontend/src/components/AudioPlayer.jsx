import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import DisplayTrack from './DisplayTrack';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import { setTrackIndex, setCurrentTrack, setIsPlaying } from '../reduxToolkit/playerSlice';

function AudioPlayer() {
  const tracks = useSelector((state) => state.player.tracks);
  const trackIndex = useSelector((state) => state.player.trackIndex);
  const currentTrack = useSelector((state) => state.player.currentTrack) || tracks[0];
  const isPlaying = useSelector((state) => state.player.isPlaying);

  const dispatch = useDispatch();

  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  const audioRef = useRef();
  const progressBarRef = useRef();
  const playAnimationRef = useRef();

  const togglePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleNext = () => {
    if (trackIndex >= tracks.length - 1) {
      dispatch(setTrackIndex(0));
      dispatch(setCurrentTrack(tracks[0]));
    } else {
      dispatch(setTrackIndex(trackIndex + 1));
      dispatch(setCurrentTrack(tracks[trackIndex + 1]));
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
      dispatch(setTrackIndex(lastTrackIndex));
      dispatch(setCurrentTrack(tracks[lastTrackIndex]));
    } else {
      dispatch(setTrackIndex(trackIndex - 1));
      dispatch(setCurrentTrack(tracks[trackIndex - 1]));
    }
  };

  useEffect(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <div>
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
      </div>
    </div>
  );
}
export default AudioPlayer;
