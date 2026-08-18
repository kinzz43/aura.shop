import type { Product } from "@/entities/product/model/types";

export interface CartItem {
  product: Product;
  count: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
}