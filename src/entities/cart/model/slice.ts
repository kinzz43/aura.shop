import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/entities/product/model/types";
import type { CartItem, CartState } from "./types";

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

const calcTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.count,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  return { totalPrice, totalCount };
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const findItem = state.items.find(
        (obj) => obj.product.id === action.payload.id
      );

      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({
          product: action.payload,
          count: 1,
        });
      }

      const { totalPrice, totalCount } = calcTotals(state.items);
      state.totalPrice = totalPrice;
      state.totalCount = totalCount;
    },
    minusItem(state, action: PayloadAction<string>) {
      const findItem = state.items.find((obj) => obj.product.id === action.payload);

      if (findItem) {
        if (findItem.count > 1) {
          findItem.count--;
        } else {
          state.items = state.items.filter(
            (obj) => obj.product.id !== action.payload
          );
        }
      }

      const { totalPrice, totalCount } = calcTotals(state.items);
      state.totalPrice = totalPrice;
      state.totalCount = totalCount;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (obj) => obj.product.id !== action.payload
      );

      const { totalPrice, totalCount } = calcTotals(state.items);
      state.totalPrice = totalPrice;
      state.totalCount = totalCount;
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalCount = 0;
    },
  },
});

export const { addItem, minusItem, removeItem, clearItems } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;