import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import { Logo } from "@/shared/ui/Logo/Logo";
import styles from "./Header.module.css";

export const Header = () => {
  const { totalPrice, totalCount } = useAppSelector((state) => state.cart);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false); // Прячем при скролле вниз
      } else {
        setIsVisible(true); // Показываем при скролле вверх
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`${styles.header} ${!isVisible ? styles["header--hidden"] : ""}`}
    >
      <div className={styles.header__container}>
        <a href="#" style={{ display: "inline-block" }}>
          <Logo />
        </a>

        <div className={styles.header__search}>
          <input
            type="text"
            placeholder="Поиск девайсов..."
            className={styles.header__searchInput}
          />
        </div>

        <div className={styles.header__cart}>
          <span>Корзина</span>
          {totalCount > 0 && (
            <span className={styles.header__cartBadge}>{totalCount}</span>
          )}
          <span>{totalPrice} ₽</span>
        </div>
      </div>
    </header>
  );
};