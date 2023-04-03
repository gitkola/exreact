/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    tracks: [],
    isLoading: false,
    trackIndex: 0,
    currentTrack: null,
    isPlaying: false,
  },
  reducers: {
    setTracks(state, action) {
      state.tracks = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTrackIndex(state, action) {
      state.trackIndex = action.payload;
    },
    setCurrentTrack(state, action) {
      state.currentTrack = action.payload;
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
  },
});

export default playerSlice.reducer;
export const {
  setTracks,
  setIsLoading,
  setTrackIndex,
  setCurrentTrack,
  setIsPlaying,
} = playerSlice.actions;

export const loadTracks = () => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    const response = await axios.get('/api/playlist');
    dispatch(setTracks(response.data));
    dispatch(setIsLoading(false));
  } catch (error) {
    console.log(`loadTracks ERROR: ${error}`);
    dispatch(setIsLoading(false));
  }
};
