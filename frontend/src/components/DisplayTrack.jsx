import React from 'react';

function DisplayTrack({ currentTrack }) {
  return (
    <div>
      <div className="audio-info">
        <p className="title">{currentTrack?.title}</p>
      </div>
    </div>
  );
}
export default DisplayTrack;
