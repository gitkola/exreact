import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import UploadBar from './UploadBar';

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

  return (
    <>
      <UploadBar onUploadSuccess={() => { fetchData(); }} />
      <AudioPlayer tracks={tracks || []} />
    </>
  );
}

export default Content;
