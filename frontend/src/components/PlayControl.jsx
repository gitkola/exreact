import React from 'react';
import { IoPlaySharp, IoPauseSharp } from 'react-icons/io5';

const buttonColor = '#cecece';

// eslint-disable-next-line import/prefer-default-export
export function PlayControl({ isPlaying, togglePlayPause }) {
  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={togglePlayPause}
      style={{
        borderWidth: 2,
        borderColor: 'gray',
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        width: 40,
        height: 40,
        background: 'transparent',
        display: 'flex',
      }}
    >
      {isPlaying ? (
        <IoPauseSharp size={20} color={buttonColor} />
      ) : (
        <IoPlaySharp size={20} color={buttonColor} />
      )}
    </div>
  );
}
