import { useAppDispatch, useAppSelector } from "@/app/store";
import { setSortBy } from "../../model/slice";
import type { SortOption } from "../../model/types";
import styles from "./SortSelect.module.css";

interface SortItem {
  key: SortOption;
  label: string;
}

const SORT_OPTIONS: SortItem[] = [
  { key: "popular", label: "по популярности" },
  { key: "price-asc", label: "сначала дешевле" },
  { key: "price-desc", label: "сначала дороже" },
  { key: "rating", label: "по рейтингу" },
];

export const SortSelect = () => {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector((state) => state.filterProducts.sortBy);

  return (
    <div className={styles.sort}>
      <span className={styles.sort__label}>Сортировка:</span>
      <select
        className={styles.sort__select}
        value={currentSort}
        onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
      >
        {SORT_OPTIONS.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};