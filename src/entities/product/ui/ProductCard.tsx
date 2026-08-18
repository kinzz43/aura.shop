import { useNavigate } from "react-router-dom"; // 1. Импортируем хук
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addItem } from "@/entities/cart/model/slice";
import type { Product } from "@/entities/product/model/types";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.product.id === product.id)
  );

  const countInCart = cartItem ? cartItem.count : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addItem(product));
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article 
      className={styles.productCard} 
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <header className={styles.productCard__header}>
        <div className={styles.productCard__media}>
          <img
            src={product.images[0] || "https://via.placeholder.com/300"}
            alt={product.title}
            className={styles.productCard__image}
          />
          {product.isNew && (
            <span className={styles.productCard__badge}>NEW</span>
          )}
        </div>

        <h3 className={styles.productCard__title}>{product.title}</h3>
        <p className={styles.productCard__description}>{product.description}</p>
      </header>

      <footer className={styles.productCard__footer}>
        <div className={styles.productCard__pricing}>
          <span className={styles.productCard__price}>{product.price} ₽</span>
          {product.oldPrice && (
            <span className={styles.productCard__priceOld}>
              {product.oldPrice} ₽
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={styles.productCard__button}
        >
          Добавить в корзину {countInCart > 0 && `(${countInCart})`}
        </button>
      </footer>
    </article>
  );
};