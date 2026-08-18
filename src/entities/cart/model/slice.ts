import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/entities/product/model/types";
import type { CartItem, CartState } from "./types";

// Функция для загрузки состояния из localStorage
const loadCartFromLS = (): CartState => {
  try {
    const data = localStorage.getItem("cart");
    return data
      ? JSON.parse(data)
      : { items: [], totalPrice: 0, totalCount: 0 };
  } catch {
    return { items: [], totalPrice: 0, totalCount: 0 };
  }
};

const initialState: CartState = loadCartFromLS();

const calcTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.count,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  return { totalPrice, totalCount };
};

// Функция для сохранения состояния в localStorage
const saveCartToLS = (state: CartState) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Ошибка сохранения корзины в localStorage:", error);
  }
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
      saveCartToLS(state);
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
      saveCartToLS(state);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (obj) => obj.product.id !== action.payload
      );

      const { totalPrice, totalCount } = calcTotals(state.items);
      state.totalPrice = totalPrice;
      state.totalCount = totalCount;
      saveCartToLS(state);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalCount = 0;
      saveCartToLS(state);
    },
  },
});

export const { addItem, minusItem, removeItem, clearItems } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;