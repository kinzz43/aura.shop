import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchProducts } from "@/entities/product/model/slice";
import { addItem } from "@/entities/cart/model/slice";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./ProductDetailsPage.module.css";

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { items, isLoading } = useAppSelector((state) => state.product);
  
  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length, isLoading]);

  const product = items.find((item) => String(item.id) === id);
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => String(item.product.id) === id)
  );

  // Безопасный сброс индекса миниатюры при смене товара без лишних рендеров
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [lastId, setLastId] = useState<string | undefined>(id);

  if (id !== lastId) {
    setLastId(id);
    setSelectedImageIndex(0);
  }

  const countInCart = cartItem ? cartItem.count : 0;

  if (isLoading || (items.length === 0 && !product)) {
    return (
      <div className={styles.productDetails}>
        <Header />
        <main className={styles.productDetails__notFound}>
          <h2>Загрузка товара...</h2>
        </main>
        <Footer />
      </div>
    );
  }

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

  const currentImage = product.images[selectedImageIndex] || product.images[0];

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
          <div className={styles.productDetails__gallery}>
            <img
              src={currentImage}
              alt={product.title}
              className={styles.productDetails__image}
            />
            {product.images.length > 1 && (
              <div className={styles.productDetails__thumbs}>
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.productDetails__thumbBtn} ${
                      selectedImageIndex === index ? styles.productDetails__thumbActive : ""
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={img} alt="" className={styles.productDetails__thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

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
              Добавить в корзину {countInCart > 0 && `(${countInCart})`}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};