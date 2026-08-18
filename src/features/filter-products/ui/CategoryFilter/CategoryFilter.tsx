import { useAppDispatch, useAppSelector } from "@/app/store";
import { setCategory } from "../../model/slice";
import type { ProductCategory } from "../../model/types";
import styles from "./CategoryFilter.module.css";

interface CategoryItem {
  key: ProductCategory;
  label: string;
}

const CATEGORIES: CategoryItem[] = [
  { key: "all", label: "Все" },
  { key: "keyboards", label: "Клавиатуры" },
  { key: "mice", label: "Мыши" },
  { key: "headsets", label: "Наушники" },
  { key: "monitors", label: "Мониторы" },
  { key: "accessories", label: "Аксессуары" },
];

export const CategoryFilter = () => {
  const dispatch = useAppDispatch();
  const currentCategory = useAppSelector(
    (state) => state.filterProducts.category
  );

  return (
    <div className={styles.categories}>
      {CATEGORIES.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.categoryBtn} ${currentCategory === key ? styles.categoryBtnActive : ""
            }`}
          onClick={() => dispatch(setCategory(key))}
        >
          {label}
        </button>
      ))}
    </div>
  );
};