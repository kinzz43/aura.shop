import type { Product } from "@/entities/product/model/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
}