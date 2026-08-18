import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { FilterState, ProductCategory, SortOption } from "./types";

const initialState: FilterState = {
  category: "all",
  minPrice: 0,
  maxPrice: 100000,
  searchQuery: "",
  sortBy: "popular",
  inStockOnly: false,
};

export const filterSlice = createSlice({
  name: "filterProducts",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setCategory(state, action: PayloadAction<ProductCategory>) {
      state.category = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
    },
    setInStockOnly(state, action: PayloadAction<boolean>) {
      state.inStockOnly = action.payload;
    },
    resetFilters(state) {
      state.category = "all";
      state.minPrice = 0;
      state.maxPrice = 100000;
      state.searchQuery = "";
      state.sortBy = "popular";
      state.inStockOnly = false;
    },
  },
});

export const {
  setSearchQuery,
  setCategory,
  setSortBy,
  setInStockOnly,
  resetFilters,
} = filterSlice.actions;

export const filterProductsReducer = filterSlice.reducer;