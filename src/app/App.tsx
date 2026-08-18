import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchProducts } from "@/entities/product/model/slice";

function App() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>AURA SHOP — Проверка Supabase & Redux</h1>

      {isLoading && <p>Загрузка товаров из базы данных...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {items.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              maxWidth: "400px",
            }}
          >
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>
              <strong>Цена:</strong> {product.price} ₽
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;