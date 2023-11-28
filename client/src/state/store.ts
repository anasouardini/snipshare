import { configureStore } from '@reduxjs/toolkit';
import resumesReducer from './resumes/resumes';
import userPreferences from './userPreferences/userPreferences';

export const store = configureStore({
  reducer: {
    resumes: resumesReducer,
    theme: userPreferences,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type StateDispatch = typeof store.dispatch;
