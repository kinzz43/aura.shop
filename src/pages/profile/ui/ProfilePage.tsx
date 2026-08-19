import { useState, useEffect } from "react";
import type { CartItem } from "@/entities/cart/model/types";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/shared/api/supabaseClient";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./ProfilePage.module.css";

interface Order {
  id: string;
  total_price: number;
  items: CartItem[];
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  balance: number;
}

export const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Ошибка получения профиля:", error.message);
      return;
    }

    if (data) {
      setProfile(data as Profile);
    }
  };

  const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка получения заказов:", error.message);
      return;
    }

    if (data) {
      setOrders(data as Order[]);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
        fetchOrders(currentUser.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
        fetchOrders(currentUser.id);
      } else {
        setProfile(null);
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        if (data.session) {
          setSuccessMsg("Регистрация успешна! Вы вошли в аккаунт.");
        } else {
          setSuccessMsg(
            "Регистрация прошла успешно! Пожалуйста, проверьте вашу почту для подтверждения аккаунта."
          );
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setErrorMsg(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <main className={styles.profilePage__main}>
          <p>Загрузка...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <Header />

      <main className={styles.profilePage__main}>
        {user ? (
          <div className={styles.profilePage__card}>
            <h1 className={styles.profilePage__title}>Личный кабинет</h1>
            <p className={styles.profilePage__email}>
              Вы вошли как: <strong>{user.email}</strong>
            </p>
            <div className={styles.profilePage__balanceCard}>
              <span>Баланс:</span>
              <strong>{profile ? `${profile.balance} ₽` : "Загрузка..."}</strong>
            </div>

            <div className={styles.profilePage__orders}>
              <h2>История заказов</h2>
              {orders.length === 0 ? (
                <p className={styles.profilePage__emptyOrders}>У вас пока нет заказов.</p>
              ) : (
                <ul className={styles.profilePage__orderList}>
                  {orders.map((order) => (
                    <li key={order.id} className={styles.profilePage__orderItem}>
                      <span>Заказ от {new Date(order.created_at).toLocaleDateString()}</span>
                      <strong>{order.total_price} ₽</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className={styles.profilePage__logoutBtn}
              onClick={handleLogout}
            >
              Выйти из аккаунта
            </button>
          </div>
        ) : (
          <div className={styles.profilePage__card}>
            <h1 className={styles.profilePage__title}>
              {isSignUp ? "Регистрация" : "Вход в аккаунт"}
            </h1>

            {errorMsg && (
              <div className={styles.profilePage__error}>{errorMsg}</div>
            )}

            {successMsg && (
              <div className={styles.profilePage__success}>{successMsg}</div>
            )}

            <form className={styles.profilePage__form} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.profilePage__input}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.profilePage__input}
              />
              <button type="submit" className={styles.profilePage__submitBtn}>
                {isSignUp ? "Зарегистрироваться" : "Войти"}
              </button>
            </form>

            <button
              type="button"
              className={styles.profilePage__toggleBtn}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
            >
              {isSignUp
                ? "Уже есть аккаунт? Войти"
                : "Нет аккаунта? Зарегистрироваться"}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};