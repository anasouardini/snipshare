import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { create, read, update, remove } from '../../tools/bridge';

interface ListItem {
  name: string;
  type: 'text';
  order: number;
  color: string;
  spacing: number;
  value: string;
}
interface Resume {
  id: string;
  title: string;
  components: (
    | {
        name: string;
        type: 'text' | 'heading';
        order: number;
        color: string;
        spacing: number;
        value: string;
      }
    | {
        name: string;
        type: 'list';
        order: number;
        color: string;
        spacing: number;
        value: ListItem[];
      }
  )[];
}
const initialState: { data: Resume[]; loaded: boolean } = {
  loaded: false,
  data: [],
};

const deleteResume = createAsyncThunk(
  'resumes/delete',
  async (targetResume: Resume) => {
    const response = await remove(`resumes/${targetResume}`);
    return response.data;
  },
);
const updateResume = createAsyncThunk(
  'resumes/update',
  async (newResume: Resume) => {
    const response = await update(`resumes/${newResume.id}`, newResume);
    return response.data;
  },
);
const createResume = createAsyncThunk(
  'resumes/clone',
  async (newResume: Resume) => {
    const response = await create(`resumes`, newResume);
    return response.data;
  },
);
const UserPreferences = createSlice({
  name: 'user preferences',
  initialState,
  reducers: {
    setResumes: (state, action) => {
      state.data = action.payload;
      if (action.payload.length) {
        state.loaded = true;
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    // ------ delete resume thunk
    builder.addCase(deleteResume.fulfilled, (state, action) => {
      // console.log('payload after update', action, state)
      state.data = state.data.filter((resume) => {
        if (action.meta.arg === resume.id) {
          return false;
        }
        return true;
      });
    });

    // ------ update resume thunk
    builder.addCase(updateResume.fulfilled, (state, action) => {
      // console.log('payload after update', action, state)
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].id === action.meta.arg.id) {
          state.data[i] = action.meta.arg;
        }
      }
    });
    builder.addCase(updateResume.rejected, (state, action) => {
      console.log('Err -> while updating a resume');
    });

    // ------ clone resume thunk
    builder.addCase(createResume.fulfilled, (state, action) => {
      // console.log('payload after update', action, state)
      state.data.push(action.meta.arg);
    });
  },
});

const asyncActions = {
  updateResume,
  cloneResume: createResume,
  createResume,
  deleteResume,
};
export const actions = { ...UserPreferences.actions, ...asyncActions };
export default UserPreferences.reducer;
