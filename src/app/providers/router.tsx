import { Routes, Route } from "react-router-dom";
import { CatalogPage } from "@/pages/catalog";
import { ProductDetailsPage } from "@/pages/product-details";
import { CartPage } from "@/pages/cart";
import { ProfilePage } from "@/pages/profile";
import { InfoPage } from "@/pages/info";
import { NotFoundPage } from "@/pages/not-found";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      {/* Маршруты для инфо-страниц */}
      <Route path="/about" element={<InfoPage title="О нас" />} />
      <Route path="/shipping" element={<InfoPage title="Доставка" />} />
      <Route path="/contacts" element={<InfoPage title="Контакты" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};