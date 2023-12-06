import { configureStore } from '@reduxjs/toolkit';
import resumes from './resumes/resumes';
import userPreferences from './userPreferences/userPreferences';
import userInfo from './userInfo/userInfo';

export const store = configureStore({
  reducer: {
    resumes,
    userPreferences,
    userInfo
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type StateDispatch = typeof store.dispatch;
