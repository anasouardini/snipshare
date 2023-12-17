import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { create, read } from '../../tools/bridge';

interface User {
  username: string;
  avatar: string;
  description: string;
}

const initialState: { data: User; loaded: boolean } = {
  loaded: false,
  data: { username: 'dummy', avatar: 'dummy', description: 'dummy' },
};

const UserPreferences = createSlice({
  name: 'user info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.data = action.payload;
      return state;
    },
  },
});

(async () => {
  const whoamiUsr = await read('whoami');
  UserPreferences.actions.setUserInfo({ payload: whoamiUsr.msg });
})();

export const actions = { ...UserPreferences.actions };
export default UserPreferences.reducer;
