import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setSearchQuery } from "@/features/filter-products/model/slice";
import { supabase } from "@/shared/api/supabaseClient";
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
  const [balance, setBalance] = useState<number | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  // Загрузка баланса пользователя
  useEffect(() => {
    const getBalance = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", session.user.id)
          .single();

        if (data) setBalance(data.balance);
      } else {
        setBalance(null);
      }
    };

    getBalance();

    // Слушаем изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        getBalance();
      } else {
        setBalance(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [totalPrice]); // Перезапрашиваем баланс после изменений в корзине/оплате

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
        className={`${styles.header} ${
          !isVisible ? styles["header--hidden"] : ""
        }`}
      >
        <div className={styles.header__container}>
          <Link to="/" style={{ display: "inline-block" }}>
            <Logo />
          </Link>

          <div className={styles.header__search}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Поиск девайсов..."
              className={styles.header__searchInput}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
                justifyContent: "center",
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

            <Link
              to="/profile"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-color)",
                color: "var(--text-main)",
                padding: "0.4rem 0.8rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
              title="Профиль"
            >
              <span>Профиль</span>
              {balance !== null && (
                <span
                  style={{
                    background: "var(--primary-color)",
                    color: "#fff",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {balance} ₽
                </span>
              )}
            </Link>

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