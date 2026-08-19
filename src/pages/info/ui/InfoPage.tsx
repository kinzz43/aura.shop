import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./InfoPage.module.css";

interface InfoPageProps {
  title: string;
}

export const InfoPage = ({ title }: InfoPageProps) => {
  return (
    <div className={styles.infoPage}>
      <Header />
      <main className={styles.infoPage__main}>
        <h1>{title}</h1>
        <p>Страница находится в разработке. Здесь будет важная информация для наших клиентов.</p>
      </main>
      <Footer />
    </div>
  );
};