import React from 'react';
// import { BsFillSpeakerFill } from 'react-icons/bs';

function DisplayTrack({ currentTrack }) {
  return (
    <div>
      <div className="audio-info">
        {/* <div className="audio-image">
          {currentTrack?.thumbnail ? (
            <img src={currentTrack?.thumbnail} alt="audio avatar" />
          ) : (
            <div className="icon-wrapper">
              <span className="audio-icon">
                <BsFillSpeakerFill />
              </span>
            </div>
          )}
        </div> */}
        <div className="text">
          <p className="title">{currentTrack?.title}</p>
        </div>
      </div>
    </div>
  );
}
export default DisplayTrack;
