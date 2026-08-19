import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addItem, minusItem, removeItem, clearItems } from "@/entities/cart/model/slice";
import styles from "./CartModal.module.css";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useAppSelector((state) => state.cart);

  if (!isOpen) return null;

  const handleGoToCart = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modal__header}>
          <h2 className={styles.modal__title}>Корзина</h2>
          
          <div className={styles.modal__actions}>
            {items.length > 0 && (
              <button
                className={styles.modal__clearBtn}
                onClick={() => dispatch(clearItems())}
              >
                Очистить
              </button>
            )}
            <button className={styles.modal__close} onClick={onClose}>
              ✕
            </button>
          </div>
        </header>

        <div className={styles.modal__content}>
          {items.length === 0 ? (
            <p className={styles.modal__empty}>Ваша корзина пуста</p>
          ) : (
            items.map(({ product, count }) => (
              <div key={product.id} className={styles.item}>
                <img
                  src={product.images[0] || "https://via.placeholder.com/60"}
                  alt={product.title}
                  className={styles.item__image}
                />
                <div className={styles.item__info}>
                  <h4 className={styles.item__title}>{product.title}</h4>
                  <span className={styles.item__price}>{product.price} ₽</span>
                </div>
                <div className={styles.item__controls}>
                  <button
                    className={styles.item__btn}
                    onClick={() => dispatch(minusItem(product.id))}
                  >
                    -
                  </button>
                  <span className={styles.item__count}>{count}</span>
                  <button
                    className={styles.item__btn}
                    onClick={() => dispatch(addItem(product))}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.item__deleteBtn}
                  onClick={() => dispatch(removeItem(product.id))}
                  title="Удалить товар"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className={styles.modal__footer}>
            <div className={styles.modal__total}>
              <span>Итого:</span>
              <span>{totalPrice} ₽</span>
            </div>
            <button 
              className={styles.modal__checkoutBtn}
              onClick={handleGoToCart}
            >
              Перейти в корзину
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};