import { combineReducers, configureStore } from '@reduxjs/toolkit';
import playerSlice from './playerSlice';

const rootReducer = combineReducers({
  player: playerSlice,
});

const store = configureStore({
  reducer: rootReducer,
});
export default store;
