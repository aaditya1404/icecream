import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore as db } from "../firebase/clientApp";

interface Review {
  reviewId: string;  
  authorUserId: string;
  // isGood: boolean;
  productId: string;
  text: string;
  createdAt: string;
}


interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId: string, { rejectWithValue }) => {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("productId", "==", productId));
      const querySnapshot = await getDocs(q);

      const reviewsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          reviewId: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null, 
        };
      });

      return reviewsData as Review[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch reviews");
    }
  }
);


// Create a slice for reviews
const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  } as ReviewsState,
  reducers: {
    addReview: (state, action) => {
      state.reviews.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
