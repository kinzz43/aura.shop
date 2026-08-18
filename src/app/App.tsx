import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { fetchProducts } from "@/entities/product/model/slice";
import { ProductCard } from "@/entities/product/ui/ProductCard";
import { CategoryFilter } from "@/features/filter-products/ui/CategoryFilter/CategoryFilter";
import { SortSelect } from "@/features/filter-products/ui/SortSelect/SortSelect";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";

function App() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.product);
  const { searchQuery, category, sortBy } = useAppSelector(
    (state) => state.filterProducts
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        category === "all" || item.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0; // Для "popular" или значения по умолчанию
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem",
          flex: 1,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <CategoryFilter />
          <SortSelect />
        </div>

        {isLoading && <p>Загрузка каталога...</p>}
        {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

        {!isLoading && !error && filteredAndSortedItems.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
            Ничего не найдено
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredAndSortedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;