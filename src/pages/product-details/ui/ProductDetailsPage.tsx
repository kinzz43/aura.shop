import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addItem } from "@/entities/cart/model/slice";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./ProductDetailsPage.module.css";

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) =>
    state.product.items.find((item) => String(item.id) === id)
  );

  if (!product) {
    return (
      <div className={styles.productDetails}>
        <Header />
        <main className={styles.productDetails__notFound}>
          <h2>Товар не найден</h2>
          <button
            onClick={() => navigate("/")}
            className={styles.productDetails__backBtn}
          >
            Вернуться в каталог
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.productDetails}>
      <Header />

      <main className={styles.productDetails__main}>
        <div className={styles.productDetails__breadcrumbs}>
          <Link to="/" className={styles.productDetails__breadcrumbsLink}>
            Каталог
          </Link>{" "}
          /{" "}
          <span className={styles.productDetails__breadcrumbsCurrent}>
            {product.title}
          </span>
        </div>

        <div className={styles.productDetails__grid}>
          <img
            src={product.images[0]}
            alt={product.title}
            className={styles.productDetails__image}
          />

          <div className={styles.productDetails__info}>
            <h1 className={styles.productDetails__title}>{product.title}</h1>
            <p className={styles.productDetails__description}>
              {product.description}
            </p>

            {product.specs && product.specs.length > 0 && (
              <div className={styles.productDetails__specs}>
                <h3 className={styles.productDetails__specsTitle}>Характеристики</h3>
                <ul className={styles.productDetails__specsList}>
                  {product.specs.map((spec, index) => (
                    <li key={index} className={styles.productDetails__specsItem}>
                      <span className={styles.productDetails__specName}>{spec.name}:</span>
                      <span className={styles.productDetails__specValue}>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.productDetails__price}>
              {product.price} ₽
            </div>
            
            <button
              className={styles.productDetails__buyBtn}
              onClick={() => dispatch(addItem(product))}
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};