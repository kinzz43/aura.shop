import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { fetchProducts } from "@/entities/product/model/slice";
import { ProductCard } from "@/entities/product/ui/ProductCard";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";

function App() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", flex: 1, width: "100%" }}>
        {isLoading && <p>Загрузка каталога...</p>}
        {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;