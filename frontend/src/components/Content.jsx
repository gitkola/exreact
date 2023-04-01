import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';

function Content() {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    setIsLoading(true);
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
    fetchData();
  }, []);
  if (isLoading) return (<div>Loading...</div>);
  return <AudioPlayer tracks={tracks || []} />;
}

export default Content;
