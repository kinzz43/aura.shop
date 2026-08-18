import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setSearchQuery } from "@/features/filter-products/model/slice";
import { Logo } from "@/shared/ui/Logo/Logo";
import { CartModal } from "@/widgets/cart-modal/ui/CartModal";
import styles from "./Header.module.css";

import moonIcon from "@/shared/assets/moon.svg";
import sunIcon from "@/shared/assets/sun2.svg";

export const Header = () => {
  const dispatch = useAppDispatch();
  const { totalPrice, totalCount } = useAppSelector((state) => state.cart);
  const searchQuery = useAppSelector(
    (state) => state.filterProducts.searchQuery
  );

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Инициализация темы из localStorage или по умолчанию 'dark'
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  // При изменении темы меняем атрибут на html и сохраняем в LS
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
        className={`${styles.header} ${!isVisible ? styles["header--hidden"] : ""
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

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Кнопка переключения темы */}
            <button
              onClick={toggleTheme}
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-color)",
                color: "var(--text-main)",
                padding: "0.4rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "Center",
              }}
              title="Сменить тему"
            >
              <img
                src={theme === "dark" ? sunIcon : moonIcon}
                alt={theme === "dark" ? "Темная тема" : "Светлая тема"}
                width={20}
                height={20}
                style={{ display: "block" }}
              />
            </button>

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
        </div>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};