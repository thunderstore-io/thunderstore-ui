import { ReactNode, useState } from "react";
import styles from "./search.module.css";

interface SearchBoxProps<T> {
  placeholder?: string;
  renderOption: (option: T) => ReactNode;
  keyExtractor: (option: T) => string | number;
  options: T[];
  onSelect?: (option: T) => void;
}

export const SearchBox = <T,>({
  placeholder,
  renderOption,
  keyExtractor,
  options,
  onSelect,
}: SearchBoxProps<T>) => {
  const [isFocused, setFocused] = useState<boolean>(false);

  return (
    <div
      className={styles.searchField}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
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
      {isFocused && (
        <div className={styles.optionsAnchor}>
          <div className={styles.optionsBox}>
            {options.map((option) => {
              return (
                <button
                  className={styles.optionButton}
                  key={keyExtractor(option)}
                  onClick={() => onSelect && onSelect(option)}
                >
                  {renderOption(option)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
