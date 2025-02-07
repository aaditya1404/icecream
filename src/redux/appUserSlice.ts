import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface appUserState {
  appUser: { uid: string; name: string; photoURL: string} | null; 
  loading: boolean;
  error: string | null;
}

const initialState: appUserState = {
  appUser: null,
  loading: false,
  error: null,
};

const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setAppUser: (state, action: PayloadAction<{ uid: string; name: string; photoURL: string } | null>) => {
      state.appUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAppUser, setLoading, setError } = appUserSlice.actions;

export default appUserSlice.reducer;