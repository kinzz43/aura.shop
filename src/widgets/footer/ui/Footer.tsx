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
              <a href="#" className={styles.footer__link}>Клавиатуры</a>
              <a href="#" className={styles.footer__link}>Мыши</a>
              <a href="#" className={styles.footer__link}>Наушники</a>
            </div>

            <div className={styles.footer__column}>
              <span className={styles.footer__title}>Информация</span>
              <a href="#" className={styles.footer__link}>О нас</a>
              <a href="#" className={styles.footer__link}>Доставка</a>
              <a href="#" className={styles.footer__link}>Контакты</a>
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