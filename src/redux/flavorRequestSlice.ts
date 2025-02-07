import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFlavorRequests, addFlavorRequest, voteFlavorRequest } from "@/firebase/firestore";

interface FlavorRequest {
  id: string;
  createdByUserId: string;
  description: string;
  flavorName: string;
  referenceURL: string;
  voteUserIds: string[];
  votes: number;
}

// Initial state
interface FlavorRequestState {
  flavorRequests: FlavorRequest[];
  loading: boolean;
  error: string | null;
}

// Async thunk to fetch flavor requests from Firestore
export const fetchFlavorRequests = createAsyncThunk(
  "flavorRequests/fetchFlavorRequests",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFlavorRequests();
      return data as FlavorRequest[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch flavor requests");
    }
  }
);

// Async thunk to add a new flavor request
export const createFlavorRequest = createAsyncThunk(
  "flavorRequests/createFlavorRequest",
  async (flavorData: Omit<FlavorRequest, "id">, { rejectWithValue }) => {
    try {
      const docRef = await addFlavorRequest(flavorData);
      return { id: docRef.id, ...flavorData }; 
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add flavor request");
    }
  }
);

// Async thunk to vote on a flavor request
export const voteOnFlavorRequest = createAsyncThunk(
  "flavorRequests/voteOnFlavorRequest",
  async ({ requestId, userId }: { requestId: string, userId: string }, { rejectWithValue }) => {
    try {
      await voteFlavorRequest(requestId, userId); 
      return { requestId, userId }; 
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to vote on flavor request");
    }
  }
);

// Create a slice
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
      .addCase(fetchFlavorRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlavorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.flavorRequests = action.payload;
      })
      .addCase(fetchFlavorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createFlavorRequest.fulfilled, (state, action) => {
        state.flavorRequests.unshift(action.payload); 
      })
      .addCase(createFlavorRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
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

