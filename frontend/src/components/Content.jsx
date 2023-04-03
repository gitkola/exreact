import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AudioPlayer from './AudioPlayer';
import UploadBar from './UploadBar';
import {
  loadTracks, setTrackIndex, setCurrentTrack, setIsPlaying,
} from '../reduxToolkit/playerSlice';
import { PlayList } from './PlayList';

function Content() {
  const tracks = useSelector((state) => state.player.tracks);
  const trackIndex = useSelector((state) => state.player.trackIndex);
  const isLoading = useSelector((state) => state.player.isLoading);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTracks());
  }, []);

  if (isLoading) return (<div>Loading...</div>);
  return (
    <div className="container">
      <div className="header">
        <UploadBar onUploadSuccess={() => { dispatch(loadTracks()); }} />
        <AudioPlayer tracks={tracks || []} />
      </div>
      <div className="content">
        <PlayList
          tracks={tracks}
          onTrackClick={(idx) => {
            dispatch(setTrackIndex(idx));
            dispatch(setCurrentTrack(tracks[idx]));
          }}
          {...{
            trackIndex,
            isPlaying,
            togglePlayPause: () => dispatch(setIsPlaying(!isPlaying)),
          }}
        />
      </div>
    </div>
  );
  // return (
  //   <div className="fullscreen">
  //     <div className="header">
  //       <UploadBar onUploadSuccess={() => { dispatch(loadTracks()); }} />
  //     </div>
  //     <div className="main">
  //       <AudioPlayer tracks={tracks || []} />
  //     </div>
  //     <div className="footer" />
  //   </div>
  // );
}

export default Content;
