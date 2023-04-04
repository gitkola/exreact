import React from 'react';
import {
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
  IoPlaySharp,
  IoPauseSharp,
} from 'react-icons/io5';

import { IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from 'react-icons/io';

function Controls({
  handleNext,
  isPlaying,
  muteVolume,
  volume,
  onClickMute,
  setVolume,
  togglePlayPause,
  handlePrevious,
}) {
  return (
    <div className="controls-wrapper">
      <div className="controls">
        <button type="button" onClick={handlePrevious}>
          <IoPlaySkipBackSharp color="gray" size={48} />
        </button>
        {/* <button onClick={skipBackward}>
          <IoPlayBackSharp />
        </button> */}
        <button type="button" onClick={togglePlayPause}>
          {isPlaying ? (
            <IoPauseSharp color="gray" size={48} />
          ) : (
            <IoPlaySharp color="gray" size={48} />
          )}
        </button>
        {/* <button onClick={skipForward}>
          <IoPlayForwardSharp />
        </button> */}
        <button type="button" onClick={handleNext}>
          <IoPlaySkipForwardSharp color="gray" size={48} />
        </button>
      </div>
      <div className="volume">
        <button type="button" onClick={onClickMute}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {muteVolume || volume < 5 ? (
            <IoMdVolumeOff color="gray" />
          ) : volume < 40 ? (
            <IoMdVolumeLow color="gray" />
          ) : (
            <IoMdVolumeHigh color="gray" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          style={{
            background: `linear-gradient(to right, lightseagreen ${volume}%, #ccc ${volume}%)`,
          }}
        />
      </div>
    </div>
  );
}

export default Controls;
