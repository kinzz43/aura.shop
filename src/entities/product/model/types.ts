export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  category: "keyboards" | "mice" | "headsets" | "monitors" | "accessories";
  images: string[];
  inStock: boolean;
  isNew?: boolean;
  specs: ProductSpec[];
  createdAt: string;
}