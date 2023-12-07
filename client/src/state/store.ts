import { configureStore } from '@reduxjs/toolkit';
import userPreferences from './userPreferences/userPreferences';
import userInfo from './userInfo/userInfo';

export const store = configureStore({
  reducer: {
    userPreferences,
    userInfo,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type StateDispatch = typeof store.dispatch;
