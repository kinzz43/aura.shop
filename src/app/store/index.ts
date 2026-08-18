import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { productReducer } from "@/entities/product/model/slice";
import { cartReducer } from "@/entities/cart/model/slice";
import { filterProductsReducer } from "@/features/filter-products/model/slice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    filterProducts: filterProductsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;