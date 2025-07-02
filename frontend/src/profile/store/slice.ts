import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateProfile } from '../api/profileAPI';
import type { ProfileState, UpdateProfileData } from '../types';
import type { User } from '../../auth/types';

const fetchProfile = createAsyncThunk<User>('profile/fetchProfile', async () => {
  const response = await getProfile();
  return response;
});

const updateProfileAction = createAsyncThunk<User, UpdateProfileData>(
  'profile/updateProfile',
  async (data) => {
    const response = await updateProfile(data);
    return response;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  } as ProfileState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Erreur lors du chargement du profil';
    });

    builder.addCase(updateProfileAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    });
    builder.addCase(updateProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Erreur lors de la mise à jour du profil';
    });
  },
});

export { fetchProfile, updateProfileAction };
export const { clearProfileError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
