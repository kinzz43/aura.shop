import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addItem, minusItem, removeItem, clearItems } from "@/entities/cart/model/slice";
import { supabase } from "@/shared/api/supabaseClient";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./CartPage.module.css";

export const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.count,
    0
  );

  const totalCount = cartItems.reduce((sum, item) => sum + item.count, 0);

  const handleCheckout = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // 1. Проверяем сессию пользователя
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/profile");
        return;
      }

      const userId = session.user.id;

      // 2. Получаем текущий баланс пользователя
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("Не удалось загрузить данные профиля");
      }

      if (profile.balance < totalPrice) {
        throw new Error(
          `Недостаточно средств. Ваш баланс: ${profile.balance} ₽, к оплате: ${totalPrice} ₽`
        );
      }

      const newBalance = profile.balance - totalPrice;

      // 3. Списываем баланс
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", userId);

      if (updateError) {
        throw new Error("Ошибка при списании средств: " + updateError.message);
      }

      // 4. Записываем заказ в базу
      const { error: orderError } = await supabase.from("orders").insert([
        {
          user_id: userId,
          total_price: totalPrice,
          items: cartItems,
        },
      ]);

      if (orderError) {
        console.error("Ошибка сохранения заказа:", orderError.message);
      }

      // 5. Успешно очищаем корзину и радуем пользователя
      dispatch(clearItems());
      setSuccessMsg("Заказ успешно оформлен! Деньги списаны с вашего баланса.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Произошла неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cartPage}>
      <Header />

      <main className={styles.cartPage__main}>
        <div className={styles.cartPage__header}>
          <h1 className={styles.cartPage__title}>Корзина</h1>
          {cartItems.length > 0 && (
            <button
              className={styles.cartPage__clearBtn}
              onClick={() => dispatch(clearItems())}
            >
              Очистить корзину
            </button>
          )}
        </div>

        {errorMsg && (
          <div style={{ color: "#ef4444", marginBottom: "1rem", fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ color: "#22c55e", marginBottom: "1rem", fontWeight: 500 }}>
            {successMsg}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className={styles.cartPage__empty}>
            <p className={styles.cartPage__emptyText}>
              {successMsg ? "Спасибо за покупку!" : "Ваша корзина пуста"}
            </p>
            <Link to="/" className={styles.cartPage__catalogBtn}>
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className={styles.cartPage__content}>
            <div className={styles.cartPage__list}>
              {cartItems.map(({ product, count }) => (
                <div key={product.id} className={styles.cartPage__item}>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className={styles.cartPage__itemImage}
                  />

                  <div className={styles.cartPage__itemInfo}>
                    <h4 className={styles.cartPage__itemTitle}>
                      {product.title}
                    </h4>
                    <span className={styles.cartPage__itemPrice}>
                      {product.price} ₽
                    </span>
                  </div>

                  <div className={styles.cartPage__itemControls}>
                    <button
                      className={styles.cartPage__itemBtn}
                      onClick={() => dispatch(minusItem(product.id))}
                    >
                      -
                    </button>
                    <span className={styles.cartPage__itemCount}>{count}</span>
                    <button
                      className={styles.cartPage__itemBtn}
                      onClick={() => dispatch(addItem(product))}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={styles.cartPage__removeBtn}
                    onClick={() => dispatch(removeItem(product.id))}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.cartPage__summary}>
              <h3 className={styles.cartPage__summaryTitle}>Итого</h3>
              <div className={styles.cartPage__summaryRow}>
                <span>Товары ({totalCount}):</span>
                <span>{totalPrice} ₽</span>
              </div>
              <div className={styles.cartPage__summaryTotal}>
                <span>К оплате:</span>
                <span>{totalPrice} ₽</span>
              </div>
              <button
                className={styles.cartPage__checkoutBtn}
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Обработка..." : "Оформить заказ"}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};