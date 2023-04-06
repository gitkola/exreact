/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
  IoPlaySharp,
  IoPauseSharp,
} from 'react-icons/io5';

import { IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from 'react-icons/io';

const buttonSize = 36;
const buttonColor = '#cecece';

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
          <IoPlaySkipBackSharp color={buttonColor} size={buttonSize} />
        </button>
        {/* <button onClick={skipBackward}>
          <IoPlayBackSharp />
        </button> */}
        <button type="button" onClick={togglePlayPause}>
          {isPlaying ? (
            <IoPauseSharp color={buttonColor} size={buttonSize} />
          ) : (
            <IoPlaySharp color={buttonColor} size={buttonSize} />
          )}
        </button>
        {/* <button onClick={skipForward}>
          <IoPlayForwardSharp />
        </button> */}
        <button type="button" onClick={handleNext}>
          <IoPlaySkipForwardSharp color={buttonColor} size={buttonSize} />
        </button>
      </div>
      <div className="volume">
        <button type="button" onClick={onClickMute}>
          {muteVolume || volume < 5 ? (
            <IoMdVolumeOff color={buttonColor} />
          ) : volume < 40 ? (
            <IoMdVolumeLow color={buttonColor} />
          ) : (
            <IoMdVolumeHigh color={buttonColor} />
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
