import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFlavorRequests, addFlavorRequest, voteFlavorRequest } from "@/firebase/firestore";

// Define the structure for a single flavor request
interface FlavorRequest {
  id: string; // Unique identifier for the request
  createdByUserId: string; // User ID of the requester
  description: string; // Description of the flavor request
  flavorName: string; // Name of the requested flavor
  referenceURL: string; // Reference URL (optional)
  voteUserIds: string[]; // List of user IDs who voted
  votes: number; // Total number of votes
}

// Define the initial state for the Redux slice
interface FlavorRequestState {
  flavorRequests: FlavorRequest[]; // List of flavor requests
  loading: boolean; // Indicates whether data is being fetched
  error: string | null; // Stores error messages if any
}

// Async thunk to fetch flavor requests from Firestore
export const fetchFlavorRequests = createAsyncThunk(
  "flavorRequests/fetchFlavorRequests",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFlavorRequests(); // Fetch data from Firestore
      return data as FlavorRequest[]; // Return data as an array of FlavorRequest objects
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch flavor requests"); // Handle errors
    }
  }
);

// Async thunk to add a new flavor request
export const createFlavorRequest = createAsyncThunk(
  "flavorRequests/createFlavorRequest",
  async (flavorData: Omit<FlavorRequest, "id">, { rejectWithValue }) => {
    try {
      const docRef = await addFlavorRequest(flavorData); // Add data to Firestore
      return { id: docRef.id, ...flavorData }; // Return the new request with its generated ID
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add flavor request"); // Handle errors
    }
  }
);

// Async thunk to vote on a flavor request
export const voteOnFlavorRequest = createAsyncThunk(
  "flavorRequests/voteOnFlavorRequest",
  async ({ requestId, userId }: { requestId: string, userId: string }, { rejectWithValue }) => {
    try {
      await voteFlavorRequest(requestId, userId); // Update votes in Firestore
      return { requestId, userId }; // Return the request ID and user ID who voted
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to vote on flavor request");
    }
  }
);

// Create the Redux slice
const flavorRequestSlice = createSlice({
  name: "flavorRequests",
  initialState: {
    flavorRequests: [],
    loading: false,
    error: null,
  } as FlavorRequestState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching flavor requests
      .addCase(fetchFlavorRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlavorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.flavorRequests = action.payload; // Store fetched flavor requests
      })
      .addCase(fetchFlavorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       // Handle adding a new flavor request
      .addCase(createFlavorRequest.fulfilled, (state, action) => {
        state.flavorRequests.unshift(action.payload); // Add the new request to the beginning of the list
      })
      .addCase(createFlavorRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Handle voting on a flavor request
      .addCase(voteOnFlavorRequest.fulfilled, (state, action) => {
        const { requestId, userId } = action.payload;
        const flavor = state.flavorRequests.find((flavor) => flavor.id === requestId);
        if (flavor && !flavor.voteUserIds.includes(userId)) {
          flavor.votes += 1;
          flavor.voteUserIds.push(userId); 
        }
      })
      .addCase(voteOnFlavorRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default flavorRequestSlice.reducer;

