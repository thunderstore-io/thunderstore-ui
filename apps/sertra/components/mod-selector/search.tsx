import { PropsWithChildren } from "react";
import styles from "./search.module.css";

interface SearchBoxProps {
  placeholder?: string;
}

export const SearchBox: React.FC<PropsWithChildren<SearchBoxProps>> = ({
  placeholder,
}) => {
  return (
    <div className={styles.searchBox}>
      <div className={styles.searchIcon}>🔍</div>
      <div className={styles.searchInputArea}>
        <input
          className={styles.searchInput}
          type={"text"}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
