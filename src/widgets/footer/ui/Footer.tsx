import { Link } from "react-router-dom";
import { Logo } from "@/shared/ui/Logo/Logo";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__top}>
          <div className={styles.footer__info}>
            <Logo />
            <p className={styles.footer__description}>
              Магазин современных девайсов и аксессуаров для работы и гейминга.
            </p>
          </div>

          <nav className={styles.footer__nav}>
            <div className={styles.footer__column}>
              <span className={styles.footer__title}>Каталог</span>
              <Link to="/?category=keyboards" className={styles.footer__link}>Клавиатуры</Link>
              <Link to="/?category=mice" className={styles.footer__link}>Мыши</Link>
              <Link to="/?category=headphones" className={styles.footer__link}>Наушники</Link>
            </div>

            <div className={styles.footer__column}>
              <span className={styles.footer__title}>Информация</span>
              <Link to="/about" className={styles.footer__link}>О нас</Link>
              <Link to="/shipping" className={styles.footer__link}>Доставка</Link>
              <Link to="/contacts" className={styles.footer__link}>Контакты</Link>
            </div>
          </nav>
        </div>

        <div className={styles.footer__bottom}>
          <p>© {new Date().getFullYear()} aura. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};