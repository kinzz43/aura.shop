import { Link } from "react-router-dom";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./NotFoundPage.module.css";

export const NotFoundPage = () => {
  return (
    <div className={styles.notFound}>
      <Header />
      <main className={styles.notFound__main}>
        <h1 className={styles.notFound__title}>404</h1>
        <p className={styles.notFound__text}>
          Кажется, этой страницы не существует.
        </p>
        <Link to="/" className={styles.notFound__btn}>
          Вернуться на главную
        </Link>
      </main>
      <Footer />
    </div>
  );
};