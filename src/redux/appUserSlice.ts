import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface for the app user
interface appUserState {
  appUser: {
    uid: string; // Unique user ID
    name: string; // User's name
    photoURL: string // User profile picture URL
  } | null;
  loading: boolean; // Indicates if data is being loaded
  error: string | null;
}

// Initial state for the Redux slice
const initialState: appUserState = {
  appUser: null, // No user logged in initially
  loading: false, // Default loading state
  error: null, // No errors initially
};

// Create a Redux slice for managing user authentication state
const appUserSlice = createSlice({
  name: 'appUser', // Name of the slice
  initialState,
  reducers: {

    // Action to set or update the authenticated user data
    setAppUser: (state, action: PayloadAction<{ uid: string; name: string; photoURL: string } | null>) => {
      state.appUser = action.payload;
    },

    // Action to update the loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Action to update the error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAppUser, setLoading, setError } = appUserSlice.actions;

export default appUserSlice.reducer;