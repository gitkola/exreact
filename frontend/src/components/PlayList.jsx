import React from 'react';
import { IoCloudDownload } from 'react-icons/io5';
import { PlayControl } from './PlayControl';

// eslint-disable-next-line import/prefer-default-export
export function PlayList({
  tracks,
  onTrackClick,
  trackIndex,
  isPlaying,
  togglePlayPause,
}) {
  console.log(tracks);
  return (
    <div className="inner">
      {Array.isArray(tracks) ? tracks.map((track, idx) => (
        <div
          key={track.src}
          style={{
            display: 'flex',
            flexDirection: 'row',
            borderBottom: 1,
            borderBottomStyle: 'solid',
            borderColor: 'lightgray',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            onClick={() => {
              onTrackClick(idx);
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            >
              <div>
                {idx < 9 ? `0${idx + 1}` : idx + 1}
              </div>
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
            <div>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 250,
                }}
              >
                {track.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'gray',
                }}
              >
                {track.LastModified}
              </div>
            </div>
          </div>
          <div style={{
            width: 50,
            display: 'flex',
            justifyContent: 'center',
          }}
          >
            <a href={track.src} download>
              <IoCloudDownload size={24} color="gray" />
            </a>
          </div>
        </div>
      )) : null}
    </div>
  );
}
