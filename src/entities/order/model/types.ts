import type { CartItem } from "@/entities/cart/model/types";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}