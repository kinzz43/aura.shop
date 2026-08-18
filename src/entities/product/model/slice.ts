import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsFromDb } from "../api/productApi";
import type { Product } from "./types";

interface ProductState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const data = await fetchProductsFromDb();
    return data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Не удалось загрузить товары";
      });
  },
});

export const productReducer = productSlice.reducer;