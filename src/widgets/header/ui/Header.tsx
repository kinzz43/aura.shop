import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setSearchQuery } from "@/features/filter-products/model/slice";
import { Logo } from "@/shared/ui/Logo/Logo";
import { CartModal } from "@/widgets/cart-modal/ui/CartModal";
import styles from "./Header.module.css";

export const Header = () => {
  const dispatch = useAppDispatch();
  const { totalPrice, totalCount } = useAppSelector((state) => state.cart);
  const searchQuery = useAppSelector(
    (state) => state.filterProducts.searchQuery
  );

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`${styles.header} ${
          !isVisible ? styles["header--hidden"] : ""
        }`}
      >
        <div className={styles.header__container}>
          <a href="#" style={{ display: "inline-block" }}>
            <Logo />
          </a>

          <div className={styles.header__search}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Поиск девайсов..."
              className={styles.header__searchInput}
            />
          </div>

          <div
            className={styles.header__cart}
            onClick={() => setIsCartOpen(true)}
          >
            <span>Корзина</span>
            {totalCount > 0 && (
              <span className={styles.header__cartBadge}>{totalCount}</span>
            )}
            <span>{totalPrice} ₽</span>
          </div>
        </div>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};