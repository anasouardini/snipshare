import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  theme: 'dark' | 'light';
  motion: 'reduced' | 'normal';
}

const initialState: UserPreferences = {
  theme: 'dark',
  motion: 'reduced',
};

const UserPreferences = createSlice({
  name: 'user preferences',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = state.theme;
    },
    toggleMotion: state => {
      state.motion = state.motion === 'reduced' ? 'normal' : 'reduced';
      document.body.dataset.motion = state.motion;
    },
  },
});

export const actions = UserPreferences.actions;
export default UserPreferences.reducer;
