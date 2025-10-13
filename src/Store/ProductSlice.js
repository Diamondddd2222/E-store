import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Fetch all products (default home display)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    console.log(res);
    return res.json();
  }
);

// Async thunk with dynamic category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category) => {
    const url =  `https://fakestoreapi.com/products/category/${category}`
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    allItems:[],
    items: [],
    loading: false,
    error: null,
    currentCategory: "", // track selected category
  },
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    // --- All Products ---
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


   // --- filtered Products ---
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

      
  },
});

export const { setCategory } = productSlice.actions;
export default productSlice.reducer;

