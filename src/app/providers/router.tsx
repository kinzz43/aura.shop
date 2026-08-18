import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import { ProductDetailsPage } from "@/pages/product-details";
import { NotFoundPage } from "@/pages/not-found";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};