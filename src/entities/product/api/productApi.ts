import { supabase } from "@/shared/api/supabaseClient";
import type { Product } from "@/entities/product/model/types";

export const fetchProductsFromDb = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    brand: item.brand,
    description: item.description,
    price: Number(item.price),
    oldPrice: item.old_price ? Number(item.old_price) : undefined,
    rating: Number(item.rating),
    reviewsCount: item.reviews_count,
    category: item.category,
    images: item.images,
    inStock: item.in_stock,
    isNew: item.is_new,
    specs: item.specs || [],
    createdAt: item.created_at,
  }));
};