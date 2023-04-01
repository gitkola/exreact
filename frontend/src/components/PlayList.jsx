import React from 'react';
import { PlayControl } from './PlayControl';

// eslint-disable-next-line import/prefer-default-export
export function PlayList({
  tracks,
  onTrackClick,
  trackIndex,
  isPlaying,
  togglePlayPause,
}) {
  return (
    <div
      style={{
        height: 350,
        overflowY: 'scroll',
        borderTop: 1,
        borderTopStyle: 'solid',
        borderTopColor: 'lightgray',
        borderBottom: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'lightgray',
      }}
    >
      {Array.isArray(tracks) ? tracks.map((track, idx) => (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          key={track.src}
          className="audio-info"
          onClick={() => {
            onTrackClick(idx);
          }}
          style={{
            flexDirection: 'row',
            borderBottom: 1,
            borderBottomStyle: 'solid',
            borderColor: 'lightgray',
          }}
        >
          <div style={{ background: 'lightgray' }}>
            <div
              style={{
                backgroundImage: `url(${track.thumbnail})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: 60,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <PlayControl
                  {...{
                    isPlaying: isPlaying && trackIndex === idx,
                    togglePlayPause:
                      // eslint-disable-next-line no-nested-ternary
                      trackIndex === idx && isPlaying
                        ? togglePlayPause
                        : !isPlaying
                          ? togglePlayPause
                          : () => {},
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ color: 'gray' }}>{track.author}</div>
            {track.title}
          </div>
        </div>
      )) : null}
    </div>
  );
}
