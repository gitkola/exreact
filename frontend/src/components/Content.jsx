import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import UploadBar from './UploadBar';
// import { PlayList } from './PlayList';

function Content() {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState(null);

  async function fetchData() {
    try {
      const response = await axios.get('/api/playlist');
      setTracks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(`fetchData ERROR: ${error}`);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  if (isLoading) return (<div>Loading...</div>);
  // return (
  //   <div className="container">
  //     <div className="header">
  //       <UploadBar onUploadSuccess={() => { fetchData(); }} />
  //       <AudioPlayer tracks={tracks || []} />
  //     </div>
  //     <div className="content">
  //       <PlayList
  //         tracks={tracks}
  //         // onTrackClick={(idx) => {
  //         //   // setTrackIndex(idx);
  //         //   // setCurrentTrack(tracks[idx]);
  //         // }}
  //         // {...{
  //         //   trackIndex,
  //         //   isPlaying,
  //         //   togglePlayPause,
  //         // }}
  //       />
  //     </div>
  //   </div>
  // );
  return (
    <div className="fullscreen">
      <div className="header">
        <UploadBar onUploadSuccess={() => { fetchData(); }} />
      </div>
      <div className="main">
        <AudioPlayer tracks={tracks || []} />
      </div>
      <div className="footer" />
    </div>
  );
}

export default Content;
