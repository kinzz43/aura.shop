export type ProductCategory = "all" | "keyboards" | "mice" | "eadsets" | "monitors" | "accessories";

export type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

export interface FilterState {
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  sortBy: SortOption;
  inStockOnly: boolean;
}