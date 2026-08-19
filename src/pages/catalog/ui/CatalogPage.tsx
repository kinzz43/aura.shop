import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchProducts } from "@/entities/product/model/slice";
import { setCategory } from "@/features/filter-products/model/slice";
import type { ProductCategory } from "@/features/filter-products/model/types";
import { ProductCard } from "@/entities/product/ui/ProductCard";
import { CategoryFilter } from "@/features/filter-products/ui/CategoryFilter/CategoryFilter";
import { SortSelect } from "@/features/filter-products/ui/SortSelect/SortSelect";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./CatalogPage.module.css";

const ITEMS_PER_PAGE = 8;

export const CatalogPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { items, isLoading, error } = useAppSelector(
    (state) => state.product
  );

  const { searchQuery, category, sortBy } = useAppSelector(
    (state) => state.filterProducts
  );

  const filterKey = `${searchQuery}|${category}|${sortBy}`;

  const [visibleState, setVisibleState] = useState({
    key: filterKey,
    count: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    const categoryParam = searchParams.get("category");

    if (categoryParam) {
      dispatch(setCategory(categoryParam as ProductCategory));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredAndSortedItems = [...items]
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        category === "all" || item.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }

      if (sortBy === "price-desc") {
        return b.price - a.price;
      }

      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      return 0;
    });

  const visibleCount =
    visibleState.key === filterKey
      ? visibleState.count
      : ITEMS_PER_PAGE;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        setVisibleState((prev) => {
          const currentCount =
            prev.key === filterKey ? prev.count : ITEMS_PER_PAGE;

          const nextCount = Math.min(
            currentCount + ITEMS_PER_PAGE,
            filteredAndSortedItems.length
          );

          if (nextCount === currentCount) {
            return prev;
          }

          return {
            key: filterKey,
            count: nextCount,
          };
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filterKey, filteredAndSortedItems.length]);

  const visibleItems = filteredAndSortedItems.slice(0, visibleCount);

  return (
    <div className={styles.catalogPage}>
      <Header />

      <main className={styles.catalogPage__main}>
        <div className={styles.catalogPage__filters}>
          <CategoryFilter />
          <SortSelect />
        </div>

        {isLoading && <p>Загрузка каталога...</p>}

        {error && (
          <p className={styles.catalogPage__error}>
            Ошибка: {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          filteredAndSortedItems.length === 0 && (
            <p className={styles.catalogPage__empty}>
              Ничего не найдено
            </p>
          )}

        <div className={styles.catalogPage__grid}>
          {visibleItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};