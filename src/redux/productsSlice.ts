import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "@/firebase/firestore";  // Import Firestore function

// Define the structure of a product
interface Product {
  id: string;
  description: string;
  isAvailable: boolean;
  name: string;
  photoURL: string;
  price: number;
  productCategory: string;
}

// Initial state
interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Async thunk to fetch products from Firestore
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProducts(); 
      return data as Product[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

// Create a slice for products
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  } as ProductsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
